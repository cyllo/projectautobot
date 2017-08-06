defmodule StatsLeaderboard.ProfileStatsCalculator do
  @rankable_profile_stats [
    :level, :total_games_won,
    :competitive_level
 ]

  def calculate_profile_stats(stats) do
    stats
      |> Utility.pluck_path([:profile_snapshot_statistic, :profile_statistic])
      |> Enum.map(&Map.take(&1, @rankable_profile_stats))
      |> add_back_gamer_tag_id(stats)
      |> Enum.map(&Map.to_list/1)
      |> StatsLeaderboard.RankingsCalculator.calculate_stats_rank
  end

  defp add_back_gamer_tag_id(profile_stats, stats) do
    profile_stats
      |> Enum.with_index
      |> Enum.map(fn {stat, index} ->
        Map.put(stat, :gamer_tag_id, stats_index_gamer_tag_id(stats, index))
      end)
  end

  defp stats_index_gamer_tag_id(stats, index), do: stats |> Enum.at(index) |> Map.get(:gamer_tag_id)

end
