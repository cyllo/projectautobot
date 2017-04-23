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
      add :healing_done, :integer
      add :final_blows, :integer
      add :melee_final_blows, :integer
      add :multikills, :integer
      add :recon_assists, :integer
      add :teleporter_pads_destroyed, :integer
      add :shield_generators_destroyed, :integer
      add :damage_blocked, :integer
      add :melee_kills, :integer
      add :weapon_accuracy_percentage, :integer
      add :critical_hit_accuracy_percentage, :integer
      add :multikill_best, :integer
      add :turrets_destroyed, :integer
      add :defensive_assists, :integer
      add :offensive_assists, :integer
    end
  end
end
