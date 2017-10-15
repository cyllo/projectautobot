defmodule HeroesScraper do
  import Logger, only: [info: 1]

  alias HeroesScraper.{HeroesPage, HeroPage, ModelCreator}

  def scrape_heroes_information do
    info "Scraping heroes"

    hero_srcs = HeroesPage.scrape

    info "Scraping hero pages"

    hero_srcs
      |> Task.async_stream(&HeroPage.scrape_hero/1, max_concurrency: 15, timeout: :timer.seconds(10))
      |> Stream.map(fn {:ok, {:ok, hero}} -> hero end)
      |> Enum.to_list
      |> ModelCreator.create_heroes
  end
end
