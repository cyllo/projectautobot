defmodule Scraper.DataProcessor.TotalStatsCalculator do
  def calculate_hero_totals(heroes_stats) do
    heroes_stats
      |> Utility.pluck(:stats)
      |> calculate_stats_total
  end

  defp calculate_stats_total(stats) do
    Enum.reduce(stats, %{}, &Utility.merge_map_total/2)
  end
end
