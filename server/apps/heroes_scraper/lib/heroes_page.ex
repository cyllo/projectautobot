defmodule HeroesScraper.HeroesPage do
  alias HeroesScraper.HeroesPage.{Scraper, DataProcessor}

  def scrape do
    with {:ok, heroes_src} <- Scraper.fetch_heroes_page do
      DataProcessor.process_heroes(heroes_src)
    end
  end
end
