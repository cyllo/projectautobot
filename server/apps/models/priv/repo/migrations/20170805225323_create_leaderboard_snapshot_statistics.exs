defmodule Models.Repo.Migrations.CreateLeaderboardSnapshotStatistics do
  use Ecto.Migration

  def change do
    create table(:leaderboard_snapshot_statistics) do
      add :hero_total_competitive_rankings, :jsonb
      add :hero_total_quickplay_rankings, :jsonb

      add :hero_competitive_rankings, :jsonb
      add :hero_quickplay_rankings, :jsonb

      add :profile_stats_rankings, :jsonb

      timestamps(type: :utc_datetime)
    end
  end
end
