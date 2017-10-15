defmodule HeroesScraper.HeroesPage.Scraper do
  alias Utility.FnFlow

  @heroes_page_url "https://playoverwatch.com/en-us/heroes"

  def fetch_heroes_page do
    with {:ok, %{body: body}} <- HTTPoison.get(@heroes_page_url) do
      {:ok, body}
    end
  end
end
