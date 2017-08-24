defmodule ProfileWatch.ProfileWatcherServer do
  use GenServer
  alias ProfileWatch.ProfileWatchList
  alias Scraper.ScrapeStatusCache

  @scrape_time_between :timer.minutes(10)

  # API
  def start_link(gamer_tag), do: GenServer.start_link(__MODULE__, gamer_tag, [])

  # SERVER
  def init(gamer_tag) do
    send self(), :scrape

    {:ok, gamer_tag}
  end

  def handle_info(:scrape, gamer_tag) do
    with true <- ProfileWatchList.gamer_tag_watched?(gamer_tag),
         {:ok, gamer_tag} <- Scraper.scrape_gamer_tag_without_status_check(gamer_tag) do
      ScrapeStatusCache.mark_tag_scraped(gamer_tag.id)

      Process.send_after self(), :scrape, @scrape_time_between

      {:noreply, gamer_tag}
    else
      false -> {:stop, :gamer_tag_not_watched, gamer_tag}
      e -> e
    end
  end
end
