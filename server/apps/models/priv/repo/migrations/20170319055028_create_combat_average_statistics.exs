defmodule Models.Repo.Migrations.CreateCombatAverageStatistics do
  use Ecto.Migration

  def change do
    create table(:combat_average_statistics) do
      add :critical_hits_average_percentage, :decimal
      add :damage_done_average, :decimal
      add :deaths_average, :decimal
      add :defensive_assists_average, :decimal
      add :eliminations_average, :decimal
      add :final_blows_average, :decimal
      add :healing_done_average, :decimal
      add :melee_final_blows_average, :decimal
      add :objective_kills_average, :decimal
      add :objective_time_average, :integer
      add :offensive_assists_average, :integer
      add :self_healing_average, :decimal
      add :solo_kills_average, :decimal
      add :time_spent_on_fire_average, :integer
      add :damage_blocked_average, :integer
      add :melee_kills_average, :decimal
    end
  end
end
