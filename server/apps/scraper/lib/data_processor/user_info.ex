defmodule Scraper.DataProcessor.UserInfo do
  alias Scraper.DataProcessor.Helpers
  @overwatch_user_info_box ".u-max-width-container.row.content-box.gutter-18"
  @overwatch_name "h1.header-masthead"
  @overwatch_total_wins "p.masthead-detail.h4 span"
  @overwatch_portrait ".player-portrait"
  @overwatch_competitive_level ".competitive-rank .h6"
  @overwatch_competitive_rank_url ".competitive-rank > img"
  @overwatch_player_level ".player-level > div"
  @overwatch_player_level_url ".player-level"

  def user_info(src) do
    user_info_container = Floki.find(src, @overwatch_user_info_box)
    platform_region = current_profile_platform_region(user_info_container)

    info = %{
      overwatch_name: Helpers.find_text(user_info_container, @overwatch_name),
      total_games_won: user_wins(user_info_container) |> String.to_integer,
      portrait_url: portrate_url(user_info_container),
      competitive_level: competitive_level(user_info_container),
      competitive_rank_url: competitive_rank_url(user_info_container),
      level: level(user_info_container),
      level_url: level_url(user_info_container),
      other_platforms: inactive_profile_region_platforms(user_info_container),
    }

    merge_platform_region(info, platform_region)
  end

  defp merge_platform_region(data, platform_region) when is_map(platform_region), do: Map.merge(data, platform_region)
  defp merge_platform_region(data, nil), do: data
  defp merge_platform_region(data, platform), do: Map.put(data, :platform, platform)

  defp user_wins(src) do
    wins_text = Helpers.find_text(src, @overwatch_total_wins)

    case Regex.run ~r/\d+[^ ]/, wins_text do
      nil -> 0
      wins -> List.first(wins)
    end
  end


  defp portrate_url(src), do: Helpers.find_img_src(src, @overwatch_portrait)
  defp level(src), do: Helpers.find_text(src, @overwatch_player_level)
  defp level_url(src), do: Helpers.find_background_img_url(src, @overwatch_player_level_url)
  defp competitive_level(src), do: Helpers.find_first_text(src, @overwatch_competitive_level)
  defp competitive_rank_url(src), do: Helpers.find_img_src(src, @overwatch_competitive_rank_url)

  defp parse_platform_region(<<platform::binary-size(2), " ", region::binary-size(2)>>), do: %{platform: platform, region: region}
  defp parse_platform_region(platforms) when is_list(platforms), do: Enum.map(platforms, &parse_platform_region/1)
  defp parse_platform_region(platform), do: platform

  defp process_inactive_platform(platform_src) do
    [platform, region, tag] = Helpers.find_href(platform_src)
      |> String.split("/")
      |> Enum.take(-3)

    if (platform === "career") do
      %{platform: region, tag: tag}
    else
      %{platform: platform, tag: tag, region: region}
    end
  end

  defp inactive_profile_region_platforms(src) do
    src
      |> Helpers.find_inactive_player_platforms
      |> Enum.map(&process_inactive_platform/1)
  end

  defp current_profile_platform_region(src) do
    src
      |> Helpers.find_active_player_platform
      |> parse_platform_region
  end
end
