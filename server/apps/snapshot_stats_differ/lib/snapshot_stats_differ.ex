defmodule SnapshotStatsDiffer do
  alias Models.Repo
  alias Models.Statistics.{Snapshots, Snapshots.SnapshotStatistic}
  alias SnapshotStatsDiffer.{RecursiveDiffer, HeroSnapshotStatsDiffer}

  def diff_snapshot_id(snapshot_id_a, snapshot_id_b) do
    with true <- snapshot_id_a !== snapshot_id_b,
         {:ok, [snapshot_a, snapshot_b]} <- get_and_sort_by_ids(snapshot_id_a, snapshot_id_b) do
      {:ok, diff(snapshot_a, snapshot_b)}
    else
      false -> {:error, "Cannot compare a snapshot with itself"}
      e -> e
    end
  end

  @doc """
    Diffs a set of snapshot statistics and returns a map containing the difference

    Returns `%{combat_average: %{stat_name: 10, other_stat: -10}}`
  """
  def diff(%SnapshotStatistic{} = snapshot_a, %SnapshotStatistic{} = snapshot_b) do
    [%{
      profile_snapshot_statistic: profile_stat_1,
      hero_snapshot_statistics: hero_stats_1
    }, %{
      profile_snapshot_statistic: profile_stat_2,
      hero_snapshot_statistics: hero_stats_2
    }] = preload_snapshots_stats([snapshot_a, snapshot_b])

    %{
      profile_snapshot_statistic: RecursiveDiffer.diff(profile_stat_1, profile_stat_2),
      hero_snapshot_statistics: HeroSnapshotStatsDiffer.diff(hero_stats_1, hero_stats_2)
    }
  end

  defp preload_snapshots_stats(model), do: Repo.preload(model, [
    hero_snapshot_statistics: [
      :combat_average_statistic, :combat_best_statistic,
      :combat_lifetime_statistic, :game_history_statistic, :match_awards_statistic
    ],
    profile_snapshot_statistic: [
      :profile_statistic,
      :statistics_averages_snapshot,
      :leaderboard_snapshot_statistic
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
