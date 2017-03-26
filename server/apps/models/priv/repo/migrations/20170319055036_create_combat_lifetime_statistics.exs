defmodule Models.Repo.Migrations.CreateCombatLifetimeStatistics do
  use Ecto.Migration

  def change do
    create table(:combat_lifetime_statistics) do
      add :solo_kills, :integer
      add :eliminations, :integer
      add :eliminations_per_life, :decimal
      add :time_spent_on_fire, :integer
      add :deaths, :integer
      add :objective_kills, :integer
      add :objective_time, :integer
      add :environmental_kills, :integer
      add :environmental_deaths, :integer
      add :damage_done, :integer
      add :shots_fired, :integer
      add :shots_hit, :integer
      add :critical_hits, :integer
      add :critical_hit_accuracy, :integer
      add :critical_hits_per_minute, :integer
      add :healing_done, :integer
      add :final_blows, :integer
      add :melee_final_blows, :integer
      add :multikill_best, :integer
      add :multikills, :integer
    end
  end
end
