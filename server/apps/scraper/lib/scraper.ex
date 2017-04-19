defmodule Scraper do
  alias Scraper.{ProfileScraper, ProfileSearcher, DataProcessor, Sorter, ModelCreator, ScrapeStatusCache}
  alias Models.Game

  @max_pages_scraping 5
  @max_stats_storing 10

  # returns flow of %{gamer_tag: scrape_res}
  def snapshot_tags(gamer_tags) do
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

  def get_profile(gamer_tag) do
    gamer_tag
      |> ProfileScraper.get_profile
      |> DataProcessor.get_profile_info
      |> Sorter.sort_stats
      |> ModelCreator.save_profile
  end

  def search_tag(gamer_tag) do
    if ScrapeStatusCache.has_searched_tag?(gamer_tag) do
      {:ok, ProfileSearcher.find_saved_tag(gamer_tag)}
    else
      with {:ok, gamer_tags} <- ProfileSearcher.find_profile_tag(gamer_tag) do
        Task.async(fn ->
          gamer_tags
            |> Enum.map(&gamer_tag_info/1)
            |> snapshot_tags
            |> Enum.to_list
        end)


        ScrapeStatusCache.mark_tag_searched(gamer_tag)
        {:ok, gamer_tags}
      else
        {:error, "no profiles found"} ->
          ScrapeStatusCache.mark_tag_searched(gamer_tag)
          {:ok, []}
      end
    end
  end

  def refetch_profiles_in_db do
    Game.get_all_gamer_tags
      |> Enum.map(&gamer_tag_info/1)
      |> snapshot_tags
      |> Enum.to_list
  end

  defp gamer_tag_info(tag_params), do: Map.take(tag_params, [:tag, :region, :platform])
end
