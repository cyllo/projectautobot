defmodule StatsLeaderboard do
  alias StatsLeaderboard.{HeroStatsCalculator, ProfileStatsCalculator}
  alias Models.Statistics.{Snapshots, Snapshots.SnapshotStatistic}

  def create_snapshot do
    get_latest_stats()
      |> calculate_stats
  end

  defp calculate_stats([]), do: {:error, "No snapshot statistics were found"}
  defp calculate_stats(stats) do
    stats
      |> HeroStatsCalculator.calculate
      |> Utility.map_keys(&Utility.join_atoms(&1, :rankings))
      |> Map.put(:profile_stats_rankings, ProfileStatsCalculator.calculate_profile_stats(stats))
      |> Snapshots.create_leaderboard
  end

  defp get_latest_stats do
    SnapshotStatistic.latest_stats_query
      |> SnapshotStatistic.preload_statistics_query
      |> Models.Repo.all
  end
end
