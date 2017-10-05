defmodule Scraper.Helpers do
  alias Models.{Game, Game.GamerTag}
  alias Scraper.ScrapeStatusCache

  def filter_and_get_non_timeout_gamer_tags(gamer_tags), do: Enum.filter(gamer_tags, &profile_not_on_timeout?/1) |> Enum.map(&gamer_tag_info/1)

  def check_gamer_tag_unscraped(gamer_tag) do
    unless ScrapeStatusCache.has_scraped_gamer_tag?(gamer_tag.id) do
      {:ok, gamer_tag}
    else
      ms_till_can_scrape = ScrapeStatusCache.ms_before_next_scrape(gamer_tag.id)

      {:error, create_wait_error(ms_till_can_scrape)}
    end
  end

  def concat_connected_gamer_tags(gamer_tags) do
    Models.Repo.preload(gamer_tags, [:connected_gamer_tags])
      |> Enum.map(fn (gamer_tag) ->
        ScrapeStatusCache.mark_tags_searched(gamer_tag.connected_gamer_tags)
        ScrapeStatusCache.mark_tags_scraped(gamer_tag.connected_gamer_tags)

        gamer_tag.connected_gamer_tags ++ [gamer_tag]
      end)
      |> List.flatten
  end

  defp profile_not_on_timeout?(gamer_tag), do: !ScrapeStatusCache.has_scraped_gamer_tag?(gamer_tag.id)
  defp gamer_tag_info(%GamerTag{} = params), do: params
  defp gamer_tag_info(tag_params), do: tag_params |> Map.take([:tag, :region, :platform]) |> Game.find_or_create_gamer_tag

  defp create_wait_error(ms_till_can_scrape) do
    %{
      message: "must wait #{Utility.ms_to_min(ms_till_can_scrape)} min (#{Utility.ms_to_sec(ms_till_can_scrape)} seconds) before scraping",
      ms_till_can_scrape: ms_till_can_scrape
    }
  end
end
