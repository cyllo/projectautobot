defmodule Scraper.ModelCreator.Heroes do
  use GenServer

  @scrape_timeout :timer.hours(12)

  # API
  def start_link(_), do: start_link()
  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def scrape_or_get do
    GenServer.call(__MODULE__, :scrape_or_get, :timer.seconds(30))
  end

  # SERVER
  def init(_) do
    {:ok, NaiveDateTime.utc_now() |> NaiveDateTime.add(-(@scrape_timeout + 1000), :millisecond)}
  end

  def handle_call(:scrape_or_get, _from, last_scraped) do
    if NaiveDateTime.diff(NaiveDateTime.utc_now(), last_scraped, :millisecond) > @scrape_timeout do
      {:reply, HeroesScraper.scrape_heroes_information(), NaiveDateTime.utc_now()}
    else
      {:reply, Models.HeroesCache.cache_list, last_scraped}
    end
  end
end
