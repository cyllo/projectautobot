defmodule Models.Repo.Migrations.CreateProfileSnapshotStatistics do
  use Ecto.Migration

  def change do
    create table(:profile_snapshot_statistics) do
      add :snapshot_statistic_id, references(:snapshot_statistics)
      add :profile_statistic_id, references(:profile_statistics)
      add :leaderboard_snapshot_statistic_id, references(:leaderboard_snapshot_statistics)
    end

    create index(:profile_snapshot_statistics, [:profile_statistic_id])
    create index(:profile_snapshot_statistics, [:snapshot_statistic_id])
    create index(:profile_snapshot_statistics, [:leaderboard_snapshot_statistic_id])
  end
end
