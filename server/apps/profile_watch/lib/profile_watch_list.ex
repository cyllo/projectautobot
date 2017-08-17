defmodule ProfileWatch.ProfileWatchList do
  # alias Scraper.ScrapeStatusCache

  def add_to_list(gamer_tag) do
    key = profile_key(gamer_tag)

    case ConCache.get(:scraper_profile_watch_store, key) do
      nil -> ConCache.put(:scraper_profile_watch_store, key, true)
      true -> {:error, "Profile is already being watched: #{key}"}
    end
  end

  def remove_from_list(gamer_tag) do
    key = profile_key(gamer_tag)

    case ConCache.get(:scraper_profile_watch_store, key) do
      nil -> ConCache.delete(:scraper_profile_watch_store, profile_key(gamer_tag))
      true -> {:error, "Profile is not being watched: #{key}"}
    end
  end

  defp profile_key(%{platform: platform, tag: tag, region: region}) do
    region <> ":" <> platform <> ":" <> tag
  end
end
