defmodule Scraper.ScrapeStatusCache do
  def mark_tag_scraped(gamer_tag_id) do
    ConCache.put(:scraper_store, :tags_scraped, get_tags_scraped() ++ [gamer_tag_id])

    gamer_tag_id
  end

  def mark_tag_searched(tag) do
    ConCache.put(:scraper_store, :tags_searched, get_tags_searched() ++ [tag])

    tag
  end

  def has_searched_tag?(tag) do
    get_tags_searched()
      |> Enum.any?(&(tag === &1))
  end

  def has_scraped_gamer_tag(gamer_tag_id) do
    get_tags_scraped()
      |> Enum.any?(&(gamer_tag_id === &1))
  end

  defp get_tags_scraped, do: ConCache.get(:scraper_store, :tags_scraped) || []
  defp get_tags_searched, do: ConCache.get(:scraper_store, :tags_searched) || []
end
