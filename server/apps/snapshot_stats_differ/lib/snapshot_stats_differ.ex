defmodule SnapshotStatsDiffer do
  alias Models.{Repo, Statistics.Snapshots.SnapshotStatistic}
  alias SnapshotStatsDiffer.{RecursiveDiffer, HeroSnapshotStatsDiffer}

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
end
