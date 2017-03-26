defmodule Scraper do
  alias Scraper.{ProfileScraper, DataProcessor, Sorter}

  @max_pages_scraping 5

  # returns flow of %{gamer_tag: scrape_res}
  def get_profiles_flow(gamer_tags) do
    Flow.from_enumerable(gamer_tags, max_demand: @max_pages_scraping)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&ProfileScraper.get_profile/1)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&DataProcessor.get_profile_info/1)
      |> Flow.partition(stages: @max_pages_scraping)
      |> Flow.map(&Sorter.sort_stats/1)
      |> Flow.reduce(&Map.new/0, fn(params, acc) -> Map.put(acc, params.gamer_tag, params) end)
  end
end
