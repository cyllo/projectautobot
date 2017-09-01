defmodule Scraper do
  import Logger, only: [info: 1]

  alias Models.Game
  alias Scraper.{
    ModelCreator, ScrapeStatusCache,
    Helpers, HtmlHelpers, ProfileScraper,
    ProfileSearcher, DataProcessor, Sorter
  }

  @max_pages_scraping 5
  @max_stats_storing 10

  def scrape_gamer_tag_by_id(gamer_tag_id) do
    with {:ok, gamer_tag} <- Game.get_gamer_tag(gamer_tag_id) do
      scrape_gamer_tag(gamer_tag)
    end
  end

  def scrape_gamer_tag(%Game.GamerTag{} = gamer_tag) do
    with {:ok, _} <- Helpers.check_gamer_tag_unscraped(gamer_tag),
         _ <- ScrapeStatusCache.mark_tag_scraped(gamer_tag.id) do
      scrape_gamer_tag_without_status_check(gamer_tag)
    end
  end

  def scrape_gamer_tag(gamer_tag) do
    gamer_tag
      |> Game.find_or_create_gamer_tag
      |> Utility.unwrap_ok_or_raise
      |> scrape_gamer_tag
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


  def scrape_gamer_tags(gamer_tags) do
    case Helpers.filter_and_get_non_timeout_gamer_tags(gamer_tags) do
      [] -> {:error, "No tags to scrape (they're all on timeout possibly?)"}
      gamer_tags ->
        case scrape_and_mark_gamer_tags(gamer_tags) do
          snap_results when is_list(snap_results) ->
            gamer_tags = snap_results
              |> Enum.map(&(&1 |> Tuple.to_list |> List.first))
              |> Api.Web.GamerTagChannel.broadcast_change

            Task.start(fn ->
              gamer_tags
                |> Enum.flat_map(&Game.get_connected_gamer_tags/1)
                |> scrape_gamer_tags
            end)

            gamer_tags

          e ->
            ScrapeStatusCache.unmark_tags_scraped(gamer_tags)
            raise e
        end
    end
  end

  defp scrape_and_mark_gamer_tags(gamer_tags) do
    try do
      gamer_tags
        |> ScrapeStatusCache.mark_tags_scraped
        |> snapshot_tags
    rescue
      e ->
        ScrapeStatusCache.unmark_tags_scraped(gamer_tags)

        raise e
    end
  end

  def search_tag(gamer_tag) do
    if ScrapeStatusCache.has_searched_tag?(gamer_tag) do
      gamer_tags = ProfileSearcher.find_saved_tags(gamer_tag)

      Task.start(fn -> scrape_gamer_tags(gamer_tags) end)

      {:ok, gamer_tags}
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
      |> Helpers.filter_and_get_non_timeout_gamer_tags
      |> scrape_and_mark_gamer_tags
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
end
