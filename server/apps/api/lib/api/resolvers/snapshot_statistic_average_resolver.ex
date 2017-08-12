defmodule Api.SnapshotStatisticsAverageResolver do
  alias Models.Statistics.Snapshots

  def average(%{type: type}, _info), do: {:ok, Snapshots.average(type)}
end
