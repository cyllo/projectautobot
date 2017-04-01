defmodule Scraper.DataProcessor.UserInfo do
  require IEx
  alias Scraper.DataProcessor.Helpers
  @overwatch_user_info_box ".u-max-width-container.row.content-box.gutter-18"
  @overwatch_name "h1.header-masthead"
  @overwatch_total_wins "p.masthead-detail.h4 span"

  def user_info(src) do
    user_info_container = Floki.find(src, @overwatch_user_info_box)

    %{
      overwatch_name: Helpers.find_text(user_info_container, @overwatch_name),
      total_wins: user_wins(user_info_container) |> String.to_integer
    }
  end

  defp user_wins(src) do
    wins_text = Helpers.find_text(src, @overwatch_total_wins)

    case Regex.run ~r/\d+[^ ]/, wins_text do
      nil -> 0
      wins -> List.first(wins)
    end
  end
end
