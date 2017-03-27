defmodule Models.Repo.Migrations.CreateCombatAverageStatistics do
  use Ecto.Migration

  def change do
    create table(:combat_average_statistics) do
      add :self_healing_average, :decimal
      add :offensive_assists_average, :integer
      add :solo_kills_average, :decimal
      add :eliminations_average, :decimal
      add :time_spent_on_file_average, :integer
      add :deaths_average, :decimal
      add :damage_done_average, :integer
      add :objective_time_average, :integer
      add :objective_kills_average, :decimal
      add :healing_done_average, :decimal
      add :final_blows_average, :decimal
      add :melee_final_blows_average, :decimal
    end
  end
end
