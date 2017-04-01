defmodule Scraper.DataProcessor.Stats do
  alias Scraper.DataProcessor.{Helpers,StatsBox}

  @quickplay_identifier "#quickplay"
  @competitive_stats_identifier "#quickplay"
  @hero_names_selector ".career-stats-section select[data-js='career-select'] option"

  def get_stats(src) do
    quickplay_stats = src
      |> Helpers.find_html(@quickplay_identifier)
      |> type_stats

    competitive_stats = src
      |> Helpers.find_html(@competitive_stats_identifier)
      |> type_stats

    %{
      quickplay: quickplay_stats,
      competitive: competitive_stats
    }
  end

  defp type_stats(src) do
    {[general_stats], heroes_stats} = src
      |> played_heroes
      |> Enum.map(&(StatsBox.parse_hero_stats(&1, src)))
      |> Enum.split_with(&is_hero_name_all_heroes/1)

    %{general_stats: general_stats.stats, heroes_stats: heroes_stats}
  end

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
