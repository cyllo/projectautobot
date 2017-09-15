defmodule Models.Repo.Migrations.CreateGameAverageStatistics do
  use Ecto.Migration

  def change do
    create table(:game_average_statistics) do
      add :solo_kills_avg_per10_min, :decimal, null: false, default: 0.0
      add :defensive_assists_avg_per10_min, :decimal, null: false, default: 0.0
      add :time_spent_on_fire_avg_per10_min, :decimal, null: false, default: 0.0
      add :objective_time_avg_per10_min, :decimal, null: false, default: 0.0
      add :deaths_avg_per10_min, :decimal, null: false, default: 0.0
      add :self_healing_avg_per10_min, :decimal, null: false, default: 0.0
      add :offensive_assists_avg_per10_min, :decimal, null: false, default: 0.0
      add :final_blows_avg_per10_min, :decimal, null: false, default: 0.0
      add :critical_hits_avg_per10_min, :decimal, null: false, default: 0.0
      add :eliminations_avg_per10_min, :decimal, null: false, default: 0.0
      add :damage_blocked_avg_per10_min, :decimal, null: false, default: 0.0
      add :hero_damage_done_avg_per10_min, :decimal, null: false, default: 0.0
      add :barrier_damage_done_avg_per10_min, :decimal, null: false, default: 0.0
      add :healing_done_avg_per10_min, :decimal, null: false, default: 0.0
      add :all_damage_done_avg_per10_min, :decimal, null: false, default: 0.0
      add :objective_kills_avg_per10_min, :decimal, null: false, default: 0.0
      add :melee_final_blows_avg_per10_min, :decimal, null: false, default: 0.0
      add :damage_amplified_avg_per10_min, :decimal, null: false, default: 0.0
    end
  end
end
