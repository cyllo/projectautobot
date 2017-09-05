defmodule ProfileWatch.ProfileWatcherServer do
  use GenServer
  import Logger

  alias ProfileWatch.ProfileWatchList
  alias Scraper.ScrapeStatusCache

  @scrape_time_between :timer.minutes(10)
  @max_scrapes_without_change 3

  # API
  def start_link(gamer_tag), do: GenServer.start_link(__MODULE__, gamer_tag, [])

  # SERVER
  def init(gamer_tag) do
    send self(), :scrape

    {:ok, {0, gamer_tag}} # {tries_since_different, gamer_tag}
  end

  def terminate(_, _), do: :shutdown

  def handle_info(:scrape, {tries_since_different, gamer_tag}) do
    with true <- ProfileWatchList.gamer_tag_watched?(gamer_tag),
         {:ok, gamer_tag} <- Scraper.scrape_gamer_tag_without_status_check(gamer_tag) do
      ScrapeStatusCache.mark_tag_scraped(gamer_tag.id)
      handle_scrape_res(self(), tries_since_different, gamer_tag)
    else
      false -> {:stop, :normal, {tries_since_different, gamer_tag}}
      e -> e
    end
  end

  def handle_scrape_res(pid, tries_since_different, gamer_tag) do
    tries_since_different = tries_since_different + 1

    cond do
      is_diff?(gamer_tag) ->
        Process.send_after pid, :scrape, @scrape_time_between

        {:noreply, {0, gamer_tag}}

      tries_since_different >= @max_scrapes_without_change ->
        Logger.info "Gamer Tag #{gamer_tag.tag} hit max #{@max_scrapes_without_change} stopping watch..."

        ProfileWatchList.remove_from_list(gamer_tag)

        {:stop, :normal, {tries_since_different, gamer_tag}}

      tries_since_different < @max_scrapes_without_change ->
        Logger.info "Gamer Tag #{gamer_tag.tag} unchanged counter #{tries_since_different}"
        Process.send_after pid, :scrape, @scrape_time_between

        {:noreply, {tries_since_different, gamer_tag}}
    end
  end

  def is_diff?(gamer_tag) do
    %{snapshot_statistics: [snapshot_a, snapshot_b]} = Models.Game.preload_latest_snapshots(gamer_tag, 2)

    with {:ok, res} <- SnapshotStatsDiffer.snapshots_different?(snapshot_a, snapshot_b) do
      res
    else
      _ -> false
    end
  end
end
