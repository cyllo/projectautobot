defmodule Api.SnapshotStatisticsAverageResolver do
  alias Models.Statistics.Snapshots.LatestSnapshotStatistic

  def average(%{is_competitive: competitive}, _info), do: {:ok, LatestSnapshotStatistic.average(is_competitive: competitive)}
  def average(_, _info), do: {:ok, LatestSnapshotStatistic.average(is_competitive: true)}
end
