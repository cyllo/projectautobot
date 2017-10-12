defmodule StatsLeaderboard do
  def snapshot_rankings do
    StatsLeaderboard.LeaderboardSnapshotter.snapshot_rankings
  end

  def average_by_platform(leaderboard_snapshot, platform, region \\ "") do
    StatsLeaderboard.PlatformRankingCalculatorServer.calculate_ranks(leaderboard_snapshot, platform, region)
  end

  def filter_leaderboard(leaderboard, params) do
    StatsLeaderboard.LeaderboardFilters.filter_by(leaderboard, params)
  end
end
