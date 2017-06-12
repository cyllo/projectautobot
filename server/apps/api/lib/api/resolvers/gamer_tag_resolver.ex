defmodule Api.GamerTagResolver do
  alias Models.Game
  alias Scraper.ScrapeStatusCache
  alias Api.Helpers
  alias Api.Web.GamerTagChannel

  def all(%{}, _info), do: {:ok, Game.get_all_gamer_tags()}
  def all(params, _info), do: {:ok, Game.get_all_gamer_tags(params)}
  def find(params, _info), do: Game.find_gamer_tag(params)

  def scrape(%{id: gamer_tag_id}, _info) do
    with {:ok, gamer_tag} <- get_gamer_tag_for_scrape(gamer_tag_id),
         _ <- ScrapeStatusCache.mark_tag_scraped(gamer_tag_id),
         %{competitive_snapshot: _} <- Scraper.get_profile(gamer_tag) do

       {:ok, gamer_tag_with_snapshot} = Game.get_gamer_tag_with_snapshots(gamer_tag_id)

       GamerTagChannel.broadcast_change(gamer_tag_with_snapshot)

       {:ok, gamer_tag_with_snapshot}
     else
       {:error, %{ms_till_can_scrape: _}} = error -> error
       error ->
         ScrapeStatusCache.unmark_tag_scraped(gamer_tag_id)
         error
    end
  end

  def search(%{tag: tag}, _info), do: tag |> Scraper.search_tag

  defp get_gamer_tag_for_scrape(gamer_tag_id) do
    if ScrapeStatusCache.has_scraped_gamer_tag?(gamer_tag_id) do
      ms_till_can_scrape = ScrapeStatusCache.ms_before_next_scrape(gamer_tag_id)

      {:error, create_error(ms_till_can_scrape)}
    else
      Game.get_gamer_tag(gamer_tag_id)
    end
  end

  defp create_error(ms_till_can_scrape) do
    %{
      message: "must wait #{Helpers.ms_to_min(ms_till_can_scrape)} min (#{Helpers.ms_to_sec(ms_till_can_scrape)} seconds) before scraping",
      ms_till_can_scrape: ms_till_can_scrape
    }
  end
end
