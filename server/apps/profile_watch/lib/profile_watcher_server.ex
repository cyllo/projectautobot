defmodule ProfileWatch.ProfileWatcherServer do
  use GenServer
  alias Scrpaer.ScrapeStatusCache

  @scrape_time_min_between 10
  @scrape_time_between :timer.minutes(@scrape_time_min_between)

  # API
  def start_link(gamer_tag), do: GenServer.start_link(__MODULE__, gamer_tag, [])

  # SERVER
  def init(gamer_tag) do
    {:ok, gamer_tag}
  end

  def handle_cast(:scrape, _from, {gamer_tag, nil}) do
    with {:ok, gamer_tag} <- Scraper.scrape_gamer_tag_without_status_check(gamer_tag) do
      Process.send_after self(), :scrape, @scrape_time_between

      ScrapeStatusCache.mark_tag_scraped(gamer_tag.id)

    end
  end

  # def handle_cast(:scrape, _from, {gamer_tag, time_last_scraped}) do
  #   with :ok <- check_can_scrape(time_last_scraped),
  #        {:ok, gamer_tag} <- Scraper.scrape_gamer_tag_without_status_check(gamer_tag) do
  #     Process.send_after self(), :scrape, @scrape_time_between

  #     ScrapeStatusCache.mark_tag_scraped(gamer_tag.id)

  #     {:reply, :ok, {gamer_tag, Timex.now()}}
  #   else
  #     e -> {:reply, {:error, e}, {gamer_tag, time_last_scraped}}
  #   end
  # end

  # def handle_cast(:end_watch, _from, state) do
  #   {:stop, {:ok, "Stopped watching gamer tag"}, state}
  # end

  # defp check_can_scrape(time_last_scraped) do
  #   time_diff = Timex.diff(time_last_scraped, Timex.now(), :minutes)
  #   if time_diff >= @scrape_time_min_between do
  #     :ok
  #   else
  #     {:error, "Must wait #{@scrape_time_min_between - time_diff} min before scraping"}
  #   end
  # end
end
