defmodule Scraper do
  alias Scraper.{ProfileScraper, DataProcessor, Sorter, ModelCreator}
  alias Models.Game

  @max_pages_scraping 5

  # returns flow of %{gamer_tag: scrape_res}
  def snapshot_tags(gamer_tags) do
    Flow.from_enumerable(gamer_tags, max_demand: @max_pages_scraping, min_demand: 1)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&ProfileScraper.get_profile/1)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&DataProcessor.get_profile_info/1)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&Sorter.sort_stats/1)
      |> Flow.reduce(&Map.new/0, fn(params, acc) -> Map.put(acc, params.gamer_tag, params) end)
  end

  def get_profile(gamer_tag) do
    gamer_tag
      |> ProfileScraper.get_profile
      |> DataProcessor.get_profile_info
      |> Sorter.sort_stats
      |> ModelCreator.save_profile
  end

  def refetch_profiles_in_db do
    Game.get_all_gamer_tags
      |> Enum.map(&(Map.get(&1, :tag)))
      |> snapshot_tags
      |> Enum.to_list
      |> save_profiles
  end

  defp save_profiles(profiles), do: Enum.map(profiles, fn({name, stats}) -> {name, ModelCreator.save_profile(stats)} end)
end
