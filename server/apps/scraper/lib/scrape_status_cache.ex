defmodule Scraper.ScrapeStatusCache do
  def search_cache_ttl, do: :timer.minutes(30)
  def scrape_cache_ttl, do: :timer.minutes(60)

  def mark_tag_searched(tag) do
    ConCache.put(:scraper_tag_search_store, Utility.normalize_gamer_tag(tag), NaiveDateTime.utc_now())

    tag
  end

  def unmark_tag_searched(tag) do
    ConCache.delete(:scraper_tag_search_store, Utility.normalize_gamer_tag(tag))

    tag
  end

  def unmark_tag_scraped(gamer_tag_id) do
    ConCache.delete(:scraper_profile_scrape_store, gamer_tag_id)

    gamer_tag_id
  end

  def mark_tag_scraped(gamer_tag_id) do
    ConCache.put(:scraper_profile_scrape_store, gamer_tag_id, NaiveDateTime.utc_now())

    gamer_tag_id
  end

  def ms_before_next_search(tag), do: tag |> get_tag_searched |> process_cache_to_time_til_search(search_cache_ttl())
  def ms_before_next_scrape(gamer_tag_id), do: gamer_tag_id |> get_tag_scraped |> process_cache_to_time_til_search(scrape_cache_ttl())

  def has_searched_tag?(tag), do: !!get_tag_searched(tag)
  def has_scraped_gamer_tag?(gamer_tag_id),  do: !!get_tag_scraped(gamer_tag_id)

  defp get_tag_searched(tag), do: ConCache.get(:scraper_tag_search_store, Utility.normalize_gamer_tag(tag))
  defp get_tag_scraped(gamer_tag_id), do: ConCache.get(:scraper_profile_scrape_store, gamer_tag_id)

  defp process_cache_to_time_til_search(res, search_ttl) do
    case res do
      nil -> 0
      last_scrape_time -> ms_till_can_scrape(last_scrape_time, search_ttl)
    end
  end

  defp ms_till_can_scrape(last_scrape, ms_ttl) do
    last_scrape
      |> NaiveDateTime.add(ms_ttl, :millisecond)
      |> NaiveDateTime.diff(NaiveDateTime.utc_now(), :millisecond)
  end
end
