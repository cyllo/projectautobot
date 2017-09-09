defmodule SnapshotStatsDiffer do
  alias Models.Statistics.Snapshots.SnapshotStatistic
  alias SnapshotStatsDiffer.{RecursiveDiffer, HeroSnapshotStatsDiffer, Helpers}

  def snapshot_ids_different?(snapshot_id_a, snapshot_id_b) do
    with {:ok, [snapshot_a, snapshot_b]} <- Helpers.fetch_snapshot_ids(snapshot_id_a, snapshot_id_b) do
      {:ok, snapshots_different?(snapshot_a, snapshot_b)}
    end
  end

  def diff_snapshot_id(snapshot_id_a, snapshot_id_b) do
    with {:ok, [snapshot_a, snapshot_b]} <- Helpers.fetch_snapshot_ids(snapshot_id_a, snapshot_id_b) do
      {:ok, diff(snapshot_a, snapshot_b)}
    end
  end

  @doc """
    Diffs a set of snapshot statistics and returns a map containing the difference

    Returns `%{game_average: %{stat_name: 10, other_stat: -10}}`
  """
  def diff(%SnapshotStatistic{} = snapshot_a, %SnapshotStatistic{} = snapshot_b) do
    [%{
      profile_snapshot_statistic: profile_stat_1,
      hero_snapshot_statistics: hero_stats_1
    }, %{
      profile_snapshot_statistic: profile_stat_2,
      hero_snapshot_statistics: hero_stats_2
    }] = Helpers.preload_snapshots_stats([snapshot_a, snapshot_b])

    %{
      profile_snapshot_statistic: RecursiveDiffer.diff(profile_stat_1, profile_stat_2),
      hero_snapshot_statistics: HeroSnapshotStatsDiffer.diff(hero_stats_1, hero_stats_2)
    }
  end

  def snapshots_different?(%SnapshotStatistic{} = snapshot_a, %SnapshotStatistic{} = snapshot_b) do
    [%{
      profile_snapshot_statistic: profile_stat_1,
      hero_snapshot_statistics: hero_stats_1
    }, %{
      profile_snapshot_statistic: profile_stat_2,
      hero_snapshot_statistics: hero_stats_2
    }] = Helpers.preload_snapshots_stats([snapshot_a, snapshot_b])


    RecursiveDiffer.is_different?(profile_stat_1, profile_stat_2) || HeroSnapshotStatsDiffer.is_different?(hero_stats_1, hero_stats_2)
  end
end
