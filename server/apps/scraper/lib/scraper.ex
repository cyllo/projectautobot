defmodule Scraper do
  alias Scraper.{HtmlHelpers, ProfileScraper, ProfileSearcher, DataProcessor, Sorter, ModelCreator, ScrapeStatusCache}
  alias Models.Game
  import Logger, only: [info: 1]

  @max_pages_scraping 5
  @max_stats_storing 10

  def scrape_gamer_tag_by_id(gamer_tag_id) do
    with {:ok, gamer_tag} <- Game.get_gamer_tag(gamer_tag_id) do
      scrape_gamer_tag(gamer_tag)
    end
  end

  def scrape_gamer_tag(%Game.GamerTag{} = gamer_tag) do
    with {:ok, _} <- check_gamer_tag_unscraped(gamer_tag),
         _ <- ScrapeStatusCache.mark_tag_scraped(gamer_tag.id) do
      scrape_gamer_tag_without_status_check(gamer_tag)
    else
      {:error, %{ms_till_can_scrape: _}} = error -> error
      e -> e
    end
  end

  def scrape_gamer_tag_without_status_check(%Game.GamerTag{} = gamer_tag) do
    with {gamer_tag, page_source} <- ProfileScraper.get_profile(gamer_tag),
         false <- HtmlHelpers.is_page_not_found?(page_source) do

      %{gamer_tag: %{id: gamer_tag_id}} = {gamer_tag, page_source}
        |> DataProcessor.get_profile_info
        |> Sorter.sort_stats
        |> ModelCreator.save_profile

      Task.start(fn ->
        Api.Web.GamerTagChannel.broadcast_change(gamer_tag_id)
      end)

      Game.get_gamer_tag_with_snapshots(gamer_tag_id)
    else
      true ->
        {:error, %{
          message: "Profile not found with #{inspect gamer_tag}",
          tag: gamer_tag.tag,
          platform: gamer_tag.platform,
          region: Map.get(gamer_tag, :region, "")
        }}
      e ->
        ScrapeStatusCache.unmark_tag_scraped(gamer_tag.id)

        e
    end
  end

  def scrape_gamer_tag(gamer_tag) do
    gamer_tag
      |> Game.find_or_create_gamer_tag
      |> Utility.unwrap_ok_or_raise
      |> scrape_gamer_tag
  end

  def scrape_gamer_tags(gamer_tags) do
    case filter_and_get_non_timeout_gamer_tags(gamer_tags) do
      [] -> {:error, "No tags to scrape (they're all on timeout possibly?)"}
      gamer_tags ->
        case gamer_tags |> ScrapeStatusCache.mark_tags_scraped |> snapshot_tags do
          snap_results when is_list(snap_results) ->
            snap_results
              |> Enum.map(&(&1 |> Tuple.to_list |> List.first))
              |> concat_connected_gamer_tags
              |> Api.Web.GamerTagChannel.broadcast_change
          e ->
            ScrapeStatusCache.unmark_tags_scraped(gamer_tags)
            raise e
        end
    end
  end

  def search_tag(gamer_tag) do
    if ScrapeStatusCache.has_searched_tag?(gamer_tag) do
      {:ok, ProfileSearcher.find_saved_tag(gamer_tag)}
    else
      with {:ok, gamer_tags} <- ProfileSearcher.find_profile_tag(gamer_tag),
           _ <- ScrapeStatusCache.mark_tag_searched(gamer_tag) do
        Task.start(fn -> scrape_gamer_tags(gamer_tags) end)

        {:ok, gamer_tags}
      else
        {:error, "no profiles found"} ->
          ScrapeStatusCache.mark_tag_searched(gamer_tag)
          {:ok, []}

        error ->
         ScrapeStatusCache.unmark_tag_searched(gamer_tag)
         error
      end
    end
  end

  def refetch_profiles_in_db do
    info "Scraping all gamer tags"

    Game.get_all_gamer_tags
      |> filter_and_get_non_timeout_gamer_tags
      |> snapshot_tags
  end

  defp snapshot_tags(gamer_tags) do
    Flow.from_enumerable(gamer_tags, max_demand: @max_pages_scraping, min_demand: 1)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&ProfileScraper.get_profile/1)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&DataProcessor.get_profile_info/1)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&Sorter.sort_stats/1)
      |> Flow.partition(stages: @max_stats_storing)
      |> Flow.map(&ModelCreator.save_profile/1)
      |> Flow.reduce(&Map.new/0, fn(params, acc) -> Map.put(acc, params.gamer_tag, params) end)
      |> Enum.to_list
  end

  defp profile_not_on_timeout?(gamer_tag), do: !ScrapeStatusCache.has_scraped_gamer_tag?(gamer_tag.id)
  defp filter_and_get_non_timeout_gamer_tags(gamer_tags), do: Enum.filter_map(gamer_tags, &profile_not_on_timeout?/1, &gamer_tag_info/1)
  defp gamer_tag_info(%Game.GamerTag{} = params), do: params
  defp gamer_tag_info(tag_params), do: tag_params |> Map.take([:tag, :region, :platform]) |> Game.find_or_create_gamer_tag

  defp check_gamer_tag_unscraped(gamer_tag) do
    unless ScrapeStatusCache.has_scraped_gamer_tag?(gamer_tag.id) do
      {:ok, gamer_tag}
    else
      ms_till_can_scrape = ScrapeStatusCache.ms_before_next_scrape(gamer_tag.id)

      {:error, create_wait_error(ms_till_can_scrape)}
    end
  end

  defp create_wait_error(ms_till_can_scrape) do
    %{
      message: "must wait #{Utility.ms_to_min(ms_till_can_scrape)} min (#{Utility.ms_to_sec(ms_till_can_scrape)} seconds) before scraping",
      ms_till_can_scrape: ms_till_can_scrape
    }
  end


  defp concat_connected_gamer_tags(gamer_tags) do
    Models.Repo.preload(gamer_tags, [:connected_gamer_tags])
      |> Enum.map(fn (gamer_tag) ->
        ScrapeStatusCache.mark_tags_searched(gamer_tag.connected_gamer_tags)
        ScrapeStatusCache.mark_tags_scraped(gamer_tag.connected_gamer_tags)

        gamer_tag.connected_gamer_tags ++ [gamer_tag]
      end)
      |> List.flatten
  end
end
