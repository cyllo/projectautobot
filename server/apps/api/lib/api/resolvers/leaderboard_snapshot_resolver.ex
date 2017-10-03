defmodule Api.LeaderboardSnapshotResolver do
  alias Models.Statistics.Snapshots

  def all(%{rank_by: rank_params} = params) do
    params
      |> Map.delete(:rank_by)
      |> all
      |> Enum.map(&average_by_platform(&1, rank_params))
  end

  def all(params, _), do: {:ok, Snapshots.get_all_leaderboard_snapshot_statistics(params)}

  def find(%{rank_by: rank_params} = params, _) do
    with {:ok, leaderboard} <- find(Map.delete(params, :rank_by), nil) do
      {:ok, average_by_platform(leaderboard, rank_params)}
    end
  end

  def find(params, _) when params === %{}, do: Snapshots.find_one_leaderboard_snapshot(last: 1)
  def find(params, _), do: Snapshots.find_one_leaderboard_snapshot(params)

  defp average_by_platform(leaderboard_snapshot, params) do
    StatsLeaderboard.average_by_platform(leaderboard_snapshot, params.platform, Map.get(params, :region, ""))
  end
end
