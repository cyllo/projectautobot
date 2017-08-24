defmodule ProfileWatch.ProfileWatchList do
  # alias Scraper.ScrapeStatusCache

  def add_to_list(gamer_tag) do
    case get_gamer_tag(gamer_tag) do
      nil -> put_gamer_tag(gamer_tag)
      true -> {:error, "Profile is already being watched: #{profile_key(gamer_tag)}"}
    end
  end

  def gamer_tag_watched?(gamer_tag) do
    case get_gamer_tag(gamer_tag) do
      nil -> false
      true -> true
    end
  end

  def remove_from_list(gamer_tag) do
    case get_gamer_tag(gamer_tag) do
      true -> ConCache.delete(:profile_scrape_watch, profile_key(gamer_tag))
      nil -> {:error, "Profile is not being watched: #{profile_key(gamer_tag)}"}
    end
  end

  defp get_gamer_tag(gamer_tag), do: ConCache.get(:profile_scrape_watch, profile_key(gamer_tag))
  defp put_gamer_tag(gamer_tag), do: ConCache.put(:profile_scrape_watch, profile_key(gamer_tag), true)
  defp profile_key(%{platform: platform, tag: tag, region: region}), do: region <> ":" <> platform <> ":" <> tag
end
