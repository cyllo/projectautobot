defmodule Scraper do
  alias Scraper.{HtmlHelpers, ProfileScraper, ProfileSearcher, DataProcessor, Sorter, ModelCreator, ScrapeStatusCache}
  alias Models.Game
  import Logger, only: [info: 1]

  @max_pages_scraping 5
  @max_stats_storing 10

  def get_profile(gamer_tag) do
    with {gamer_tag, page_source} <- ProfileScraper.get_profile(gamer_tag),
         false <- HtmlHelpers.is_page_not_found?(page_source) do
      res = {gamer_tag, page_source}
        |> DataProcessor.get_profile_info
        |> Sorter.sort_stats
        |> ModelCreator.save_profile

      Task.start(fn -> Api.Web.GamerTagChannel.broadcast_change(res.gamer_tag.id) end)

      res
    else
      true -> {:error, %{
        message: "Profile not found with #{inspect gamer_tag}",
        tag: gamer_tag.tag,
        platform: gamer_tag.platform,
        region: Map.get(gamer_tag, :region, "")
      }}
      e -> e
    end
  end

  def scrape_gamer_tags(gamer_tags) do
    gamer_tags
      |> filter_and_get_non_timeout_gamer_tags
      |> snapshot_tags
      |> Enum.to_list
      |> Enum.map(&(&1 |> Tuple.to_list |> List.first))
      |> concat_connected_gamer_tags
      |> mark_tags_scraped
      |> Api.Web.GamerTagChannel.broadcast_change
  end

  def scrape_gamer_tag_id(gamer_tag_id) do
    with {:ok, gamer_tag} <- get_gamer_tag_if_unscraped(gamer_tag_id),
         _ <- ScrapeStatusCache.mark_tag_scraped(gamer_tag_id),
         %{competitive_snapshot: _} <- Scraper.get_profile(gamer_tag) do
       Game.get_gamer_tag_with_snapshots(gamer_tag_id)
     else
       {:error, %{ms_till_can_scrape: _}} = error -> error
       error ->
         ScrapeStatusCache.unmark_tag_scraped(gamer_tag_id)
         error
    end
  end

  def search_tag(gamer_tag) do
    if ScrapeStatusCache.has_searched_tag?(gamer_tag) do
      {:ok, ProfileSearcher.find_saved_tag(gamer_tag)}
    else
      with {:ok, gamer_tags} <- ProfileSearcher.find_profile_tag(gamer_tag) do
        Task.start(fn -> scrape_gamer_tags(gamer_tags) end)
        ScrapeStatusCache.mark_tag_searched(gamer_tag)

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

  # returns flow of %{gamer_tag: scrape_res}
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
  end

  def refetch_profiles_in_db do
    info "Scraping all gamer tags"

    Game.get_all_gamer_tags
      |> filter_and_get_non_timeout_gamer_tags
      |> snapshot_tags
      |> Enum.to_list
  end

  defp profile_not_on_timeout?(gamer_tag), do: !ScrapeStatusCache.has_scraped_gamer_tag?(gamer_tag.id)
  defp filter_and_get_non_timeout_gamer_tags(gamer_tags), do: Enum.filter_map(gamer_tags, &profile_not_on_timeout?/1, &gamer_tag_info/1)
  defp gamer_tag_info(tag_params), do: Map.take(tag_params, [:tag, :region, :platform])

  defp mark_tags_searched(gamer_tags) do
    Enum.each(gamer_tags, &ScrapeStatusCache.mark_tag_searched(Map.get(&1, :tag)))

    gamer_tags
  end

  defp get_gamer_tag_if_unscraped(gamer_tag_id) do
    if ScrapeStatusCache.has_scraped_gamer_tag?(gamer_tag_id) do
      ms_till_can_scrape = ScrapeStatusCache.ms_before_next_scrape(gamer_tag_id)

      {:error, create_wait_error(ms_till_can_scrape)}
    else
      Game.get_gamer_tag(gamer_tag_id)
    end
  end

  defp create_wait_error(ms_till_can_scrape) do
    %{
      message: "must wait #{Utility.ms_to_min(ms_till_can_scrape)} min (#{Utility.ms_to_sec(ms_till_can_scrape)} seconds) before scraping",
      ms_till_can_scrape: ms_till_can_scrape
    }
  end

  defp mark_tags_scraped(gamer_tags) do
    Enum.each(gamer_tags, &ScrapeStatusCache.mark_tag_scraped(Map.get(&1, :id)))

    gamer_tags
  end

  defp concat_connected_gamer_tags(gamer_tags) do
    Models.Repo.preload(gamer_tags, [:connected_gamer_tags])
      |> Enum.map(fn (gamer_tag) ->
        mark_tags_searched(gamer_tag.connected_gamer_tags)

        gamer_tag.connected_gamer_tags ++ [gamer_tag]
      end)
      |> List.flatten
  end
end
