defmodule Api.SnapshotStatisticsAggregateResolver do
  alias Models.Statistics.Snapshots.LatestSnapshotStatistic

  def aggregate(%{is_competitive: competitive}, _info), do: {:ok, LatestSnapshotStatistic.aggregate(competitive?: competitive)}
  def aggregate(_, _info), do: {:ok, LatestSnapshotStatistic.aggregate(competitive?: true)}
end
