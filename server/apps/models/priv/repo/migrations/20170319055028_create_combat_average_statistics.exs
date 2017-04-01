defmodule Models.Repo.Migrations.CreateCombatAverageStatistics do
  use Ecto.Migration

  def change do
    create table(:combat_average_statistics) do
      add :solo_kills_average, :integer
      add :eliminations_average, :integer
      add :time_spent_on_file_average, :integer
      add :deaths_average, :integer
      add :damage_done_average, :integer
      add :objective_time_average, :integer
      add :objective_kills_average, :integer
      add :healing_done_average, :integer
      add :final_blows_average, :integer
      add :melee_final_blows_average, :integer
    end
  end
end
