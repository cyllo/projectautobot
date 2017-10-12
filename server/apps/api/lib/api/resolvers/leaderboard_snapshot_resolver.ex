defmodule Api.LeaderboardSnapshotResolver do
  alias Models.Statistics.Snapshots

  def all(params, _) do
    Snapshots.get_all_leaderboard_snapshot_statistics(params)
      |> filter_leaderboard(params)
      |> Utility.wrap_ok
  end

  def find(params, _) when params === %{} do
    with {:ok, leaderboard} <- Snapshots.find_one_leaderboard_snapshot(last: 1) do
      leaderboard
        |> filter_leaderboard(params)
        |> Utility.wrap_ok
    end
  end

  def find(params, _) do
    with {:ok, leaderboard} <- Snapshots.find_one_leaderboard_snapshot(params) do
      leaderboard
        |> filter_leaderboard(params)
        |> Utility.wrap_ok
    end
  end

  def filter_leaderboard(leaderboard, %{filters: %{statistics_props: props} = filters}) do
    params = Map.put(filters, :statistics_props, Enum.map(props, &ProperCase.snake_case/1))

    StatsLeaderboard.filter_leaderboard(leaderboard, params)
  end

  def filter_leaderboard(leaderboard, %{filters: filters}), do: StatsLeaderboard.filter_leaderboard(leaderboard, filters)
  def filter_leaderboard(leaderboard, _), do: leaderboard
end
