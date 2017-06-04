defmodule Api.SnapshotStatisticAggrigateResolver do
  alias Models.Statistics.Snapshots.LatestSnapshotStatistic

  def aggrigate(%{is_competitive: competitive}, _info), do: {:ok, LatestSnapshotStatistic.aggrigate(competitive?: competitive)}
  def aggrigate(_, _info), do: {:ok, LatestSnapshotStatistic.aggrigate(competitive?: true)}
end
