defmodule HeroesScraper.HeroPage do
  alias HeroesScraper.HeroPage.{Scraper, DataProcessor}

  def scrape_hero(hero_params) do
    with {:ok, hero_src} <- Scraper.fetch_hero(hero_params) do
      {:ok, DataProcessor.process_hero(hero_src)}
    end
  end
end
