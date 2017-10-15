defmodule HeroesScraper.HeroPage.Scraper do
  def fetch_hero(%{hero_page_link: url} = hero_props) do
    with {:ok, %{body: body}} <- HTTPoison.get(url) do
      {:ok, {Map.delete(hero_props, :hero_page_link), body}}
    end
  end
end
