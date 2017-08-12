defmodule Scraper.DataProcessor.Stats do
  alias Scraper.HtmlHelpers
  alias Scraper.DataProcessor.{StatsBox, TotalStatsCalculator}

  @quickplay_identifier "#quickplay"
  @competitive_stats_identifier "#competitive"
  @hero_names_selector ".career-stats-section select[data-js='career-select'] option"

  def get_stats(src) do
    quickplay_stats = src
      |> HtmlHelpers.find_html(@quickplay_identifier)
      |> get_stats_details

    competitive_stats = src
      |> HtmlHelpers.find_html(@competitive_stats_identifier)
      |> get_stats_details

    %{
      quickplay: quickplay_stats,
      competitive: competitive_stats
    }
  end

  defp get_stats_details(src) do
    src
      |> played_heroes
      |> Enum.map(&(StatsBox.parse_hero_stats(&1, src)))
      |> Enum.reject(&is_hero_name_all_heroes/1)
      |> process_stat_return
  end

  defp process_stat_return([]), do: %{total_stats: [], heroes_stats: []}
  defp process_stat_return(heroes_stats), do: %{
    total_stats: TotalStatsCalculator.calculate_hero_totals(heroes_stats),
    heroes_stats: heroes_stats
  }

  defp played_heroes(src) do
    src
      |> Floki.find(@hero_names_selector)
      |> Enum.map(&deserialize_hero/1)
  end

  defp deserialize_hero(hero_option) do
    text = Floki.text(hero_option)
    [value] = Floki.attribute(hero_option, "value")

    %{name: text, code: value}
  end

  defp is_hero_name_all_heroes(hero), do: hero[:name] === "ALL HEROES"
end
