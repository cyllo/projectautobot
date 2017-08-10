defmodule Scraper.ModelCreator.ProfileStats do
  alias Models.Statistics.{
    Profile,
    Snapshots.ProfileSnapshotStatistic
  }

  def create_stats_multi(multi, profile_stats, gamer_tag) do
    multi
      |> Ecto.Multi.insert(
        :profile_stats,
        create_profile_stats(gamer_tag.id, profile_stats)
      )
      |> Ecto.Multi.run(:profile_snapshot, &create_profile_snapshot(&1, profile_stats))
  end

  defp create_profile_stats(gamer_tag_id, stats) do
    stats
      |> Map.take([
        :competitive_level,
        :competitive_rank_url,
        :level,
        :level_url,
        :rank_url,
        :total_games_won
      ])
      |> Map.put(:gamer_tag_id, gamer_tag_id)
      |> Profile.create_changeset
  end

  defp create_profile_snapshot(%{
    snapshot_statistic: %{id: snapshot_id},
    profile_stats: %{id: profile_stats_id}
  }, profile_stats) do
    ProfileSnapshotStatistic.create_changeset(%{
      snapshot_statistic_id: snapshot_id,
      profile_statistic_id: profile_stats_id,
      leaderboard_snapshot_statistic_id: Map.get(profile_stats, :leaderboard_id, nil)
    }) |> Models.Repo.insert
  end
end
