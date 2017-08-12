defmodule Api.LeaderboardSnapshotResolver do
  alias Models.Statistics.Snapshots

  def all(params, _), do: {:ok, Snapshots.get_all_leaderboard_snapshot_statistics(params)}

  def find(params, _), do: Snapshots.find_one_leaderboard_snapshot(params)
  def find(%{}, _), do: Snapshots.find_one_leaderboard_snapshot(last: 1)
end
