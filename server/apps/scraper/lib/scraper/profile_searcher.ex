defmodule Scraper.ProfileSearcher do
  alias Scraper.ProfileUrl
  alias Scraper.{HtmlHelpers, DataProcessor.UserInfo, ModelCreator.UserProfile}
  alias Models.Game

  import Logger, only: [info: 1]

  @platform_possibilities ["xbl", "psn", "pc"]
  @pc_regions ["us", "eu", "kr"]
  @search_timeout :timer.seconds(10)

  def find_profile_tag(tag) do
    info "Searching for #{tag}"

    tag
      |> create_profile_url_possibilities
      |> fetch_profile_possibilities
      |> Stream.map(&process_response/1)
      |> Enum.to_list
      |> deserialize_profiles_response
  end

  def find_saved_tag(tag), do: Game.get_all_gamer_tags(tag: Utility.normalize_gamer_tag(tag))

  defp fetch_profile_possibility(profile_url) do
    case HTTPoison.get(profile_url, [], timeout: @search_timeout) do
      {:ok, %{body: res}} -> {profile_url, res}
      {:error, _} -> fetch_profile_possibility(profile_url)
    end
  end

  defp fetch_profile_possibilities(profile_urls), do: Task.async_stream(profile_urls, &fetch_profile_possibility/1, timeout: @search_timeout)

  defp process_response({:ok, {profile_url, html_src}}) do
    if (HtmlHelpers.is_page_not_found?(html_src)), do: nil, else: parse_profile(html_src, profile_url)
  end

  defp create_profile_url_possibilities(tag), do: Enum.map(@platform_possibilities, &create_platform_profile_url(tag, &1)) |> List.flatten

  defp create_platform_profile_url(tag, "pc"), do: Enum.map(@pc_regions, &create_platform_profile_url(tag, "pc", &1))
  defp create_platform_profile_url(tag, platform), do: ProfileUrl.tag_url(tag, %{platform: platform})
  defp create_platform_profile_url(tag, platform, region), do: ProfileUrl.tag_url(tag, %{platform: platform, region: region})

  defp parse_profile(html_src, profile_url), do: Map.merge(UserInfo.user_info(html_src), ProfileUrl.get_info_from_url(profile_url))

  # Would be nice to connect gamer tags at this point
  defp load_gamer_tag(params) do
    with {:ok, gamer_tag} <- Game.find_or_create_gamer_tag(params) do
      gamer_tag
    end
  end

  defp load_gamer_tags(profiles), do: Enum.map(profiles, &load_gamer_tag/1)

  defp deserialize_profiles_response(res) do
    case Enum.reject(res, &is_nil/1) do
      [] -> {:error, "no profiles found"}
      profiles -> {:ok, load_gamer_tags(profiles)}
    end
  end
end
