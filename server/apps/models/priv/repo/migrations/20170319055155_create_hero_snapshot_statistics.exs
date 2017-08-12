defmodule Models.Repo.Migrations.CreateHeroSnapshotStatistics do
  use Ecto.Migration

  def change do
    create table(:hero_snapshot_statistics) do
      add :statistic_type, :hero_snapshot_statistic_type
      add :snapshot_statistic_id, references(:snapshot_statistics)
      add :combat_best_statistic_id, references(:combat_best_statistics)
      add :combat_average_statistic_id, references(:combat_average_statistics)
      add :combat_lifetime_statistic_id, references(:combat_lifetime_statistics)
      add :match_awards_statistic_id, references(:match_awards_statistics)
      add :game_history_statistic_id, references(:game_history_statistics)
      add :hero_specific_statistic_id, references(:hero_specific_statistics)
      add :hero_id, references(:heroes)
    end

    create index(:hero_snapshot_statistics, [:statistic_type])
    create index(:hero_snapshot_statistics, [:snapshot_statistic_id])
    create index(:hero_snapshot_statistics, [:combat_best_statistic_id])
    create index(:hero_snapshot_statistics, [:combat_average_statistic_id])
    create index(:hero_snapshot_statistics, [:combat_lifetime_statistic_id])
    create index(:hero_snapshot_statistics, [:match_awards_statistic_id])
    create index(:hero_snapshot_statistics, [:game_history_statistic_id])
    create index(:hero_snapshot_statistics, [:hero_specific_statistic_id])
    create index(:hero_snapshot_statistics, [:hero_id])
  end
end
