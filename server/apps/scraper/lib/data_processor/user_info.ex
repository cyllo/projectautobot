defmodule Scraper.DataProcessor.UserInfo do
  require IEx
  alias Scraper.DataProcessor.Helpers
  @overwatch_user_info_box ".u-max-width-container.row.content-box.gutter-18"
  @overwatch_name "h1.header-masthead"
  @overwatch_total_wins "p.masthead-detail.h4 span"
  @overwatch_portrait ".player-portrait"
  @overwatch_competitive_level ".competitive-rank .h6"
  @overwatch_competitive_rank ".competitive-rank > img"
  @overwatch_player_level ".player-level > div"
  @overwatch_player_level_url ".player-level"

  def user_info(src) do
    user_info_container = Floki.find(src, @overwatch_user_info_box)

    %{
      overwatch_name: Helpers.find_text(user_info_container, @overwatch_name),
      total_games_won: user_wins(user_info_container) |> String.to_integer,
      portrait_url: portrate_url(user_info_container),
      competitive_level: competitive_level(user_info_container),
      competitive_rank_url: competitive_rank_url(user_info_container),
      level: level(user_info_container),
      level_url: rank_url(user_info_container)
    }
  end

  defp user_wins(src) do
    wins_text = Helpers.find_text(src, @overwatch_total_wins)

    case Regex.run ~r/\d+[^ ]/, wins_text do
      nil -> 0
      wins -> List.first(wins)
    end
  end

  defp portrate_url(src), do: Helpers.find_img_src(src, @overwatch_portrait)
  defp level(src), do: Helpers.find_text(src, @overwatch_player_level)
  defp rank_url(src), do: Helpers.find_background_img_url(src, @overwatch_player_level_url)
  defp competitive_level(src), do: Helpers.find_text(src, @overwatch_competitive_level)
  defp competitive_rank_url(src), do: Helpers.find_img_src(src, @overwatch_competitive_rank)
end
