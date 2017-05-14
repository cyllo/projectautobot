defmodule Api.GamerTagResolver do
  alias Models.Game
  alias Scraper.ScrapeStatusCache
  alias Api.Helpers

  def all(%{}, _info), do: {:ok, Game.get_all_gamer_tags()}
  def all(params, _info), do: {:ok, Game.get_all_gamer_tags(params)}
  def find(params, _info), do: Game.find_gamer_tag(params)

  def scrape(%{id: gamer_tag_id}, _info) do
    with {:ok, gamer_tag} <- get_gamer_tag_for_scrape(gamer_tag_id),
         _ <- ScrapeStatusCache.mark_tag_scraped(gamer_tag_id),
         %{competitive_snapshot: _} <- Scraper.get_profile(gamer_tag) do
       Game.get_gamer_tag_with_snapshots(gamer_tag_id)
     else
       _ -> ScrapeStatusCache.unmark_tag_scraped(gamer_tag_id)
    end
  end

  def search(%{tag: tag}, _info), do: Scraper.search_tag(tag)

  defp get_gamer_tag_for_scrape(gamer_tag_id) do
    if ScrapeStatusCache.has_scraped_gamer_tag?(gamer_tag_id) do
      time_till_can_scrape = ScrapeStatusCache.ms_before_next_scrape(gamer_tag_id)

      {:error, create_error(time_till_can_scrape)}
    else
      Game.get_gamer_tag(gamer_tag_id)
    end
  end

  defp create_error(time_till_can_scrape) do
    %{
      message: "must wait #{Helpers.ms_to_min(time_till_can_scrape)} min (#{Helpers.ms_to_sec(time_till_can_scrape)} seconds) before scraping",
      time_till_can_scrape: time_till_can_scrape
    }
  end
end
