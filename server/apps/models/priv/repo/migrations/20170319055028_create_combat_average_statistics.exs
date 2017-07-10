defmodule Models.Repo.Migrations.CreateCombatAverageStatistics do
  use Ecto.Migration

  def change do
    create table(:combat_average_statistics) do
      add :critical_hits_average, :decimal, null: false, default: 0
      add :damage_done_average, :decimal, null: false, default: 0
      add :deaths_average, :decimal, null: false, default: 0
      add :defensive_assists_average, :decimal, null: false, default: 0
      add :eliminations_average, :decimal, null: false, default: 0
      add :final_blows_average, :decimal, null: false, default: 0
      add :healing_done_average, :decimal, null: false, default: 0
      add :melee_final_blows_average, :decimal, null: false, default: 0
      add :objective_kills_average, :decimal, null: false, default: 0
      add :objective_time_average, :integer, null: false, default: 0
      add :offensive_assists_average, :integer, null: false, default: 0
      add :self_healing_average, :decimal, null: false, default: 0
      add :solo_kills_average, :decimal, null: false, default: 0
      add :time_spent_on_fire_average, :integer, null: false, default: 0
      add :damage_blocked_average, :integer, null: false, default: 0
      add :melee_kills_average, :decimal, null: false, default: 0
      add :melee_percentage_of_final_blows, :integer, null: false, default: 0
      add :weapon_accuracy, :integer, null: false, default: 0
      add :all_damage_done_avg_per_10_min, :integer, null: false, default: 0
    end
  end
end
