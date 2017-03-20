defmodule Models.Repo.Migrations.CreateAllHeroesSnapshotStatistics do
  use Ecto.Migration

  def change do
    create table(:all_heroes_snapshot_statistics) do
      add :snapshot_statistic_id, references(:snapshot_statistics)
      add :combat_best_statistic_id, references(:combat_best_statistics)
      add :combat_average_statistic_id, references(:combat_average_statistics)
      add :combat_lifetime_statistic_id, references(:combat_lifetime_statistics)
      add :match_awards_statistic_id, references(:match_awards_statistics)
      add :game_history_statistic_id, references(:game_history_statistics)
    end
  end
end
