defmodule Api.AverageStatisticsSnapshotResolver do
  import Api.Helpers, only: [preload_id_map: 2]

  alias Models.Statistics.Snapshots

  def all(params, _info), do: {:ok, Snapshots.get_all_statistics_averages_snapshots(params)}
  def find(params, _info), do: Snapshots.find_one_average_snapshot(params)
  def find(%{}, _info), do: Snapshots.find_one_average_snapshot(last: 1)

  def get_profile_snapshots_averages_snapshots(_, profiles) do
    preload_id_map(profiles, :statistics_averages_snapshot)
  end
end
