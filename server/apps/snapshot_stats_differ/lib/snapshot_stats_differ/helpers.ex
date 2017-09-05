defmodule SnapshotStatsDiffer.Helpers do
  alias Models.Repo
  alias Models.Statistics.Snapshots

  def fetch_snapshot_ids(snapshot_id_a, snapshot_id_b) do
    if snapshot_id_a !== snapshot_id_b do
      get_and_sort_by_ids(snapshot_id_a, snapshot_id_b)
    else
      {:error, "Cannot compare a snapshot with itself"}
    end
  end

  def preload_snapshots_stats(model), do: Repo.preload(model, [
    profile_snapshot_statistic: [:profile_statistic],
    hero_snapshot_statistics: [
      :combat_average_statistic, :combat_best_statistic,
      :combat_lifetime_statistic, :game_history_statistic, :match_awards_statistic
    ]
  ])

  defp get_and_sort_by_ids(id1, id2) do
    with [_, _] = snapshots <- Snapshots.get_snapshot_statistics_by_ids([id1, id2]) do
      {:ok, sort_snapshots(id1, snapshots)}
    else
      [] -> {:error, "No snapshots with those ID's were found"}
      [%{id: id}] -> {:error, "No snapshots with ID #{get_other_id(id, id1, id2)} were found"}
    end
  end

  defp sort_snapshots(id, [%{id: id1} = snapshot1, %{id: id2} = snapshot2]) do
    if id1 === id, do: [snapshot1, snapshot2], else: [snapshot2, snapshot1]
  end

  defp get_other_id(id, id1, id2), do: if id1 === id, do: id2, else: id1
end
