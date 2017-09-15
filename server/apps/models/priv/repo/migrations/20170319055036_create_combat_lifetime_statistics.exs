defmodule Models.Repo.Migrations.CreateCombatLifetimeStatistics do
  use Ecto.Migration

  def change do
    create table(:combat_lifetime_statistics) do
      add :solo_kills, :integer, null: false, default: 0
      add :eliminations, :integer, null: false, default: 0
      add :eliminations_per_life, :decimal, null: false, default: 0
      add :time_spent_on_fire, :integer, null: false, default: 0
      add :deaths, :integer, null: false, default: 0
      add :objective_kills, :integer, null: false, default: 0
      add :objective_time, :integer, null: false, default: 0
      add :environmental_kills, :integer, null: false, default: 0
      add :all_damage_done, :integer, null: false, default: 0
      add :critical_hits, :integer, null: false, default: 0
      add :healing_done, :integer, null: false, default: 0
      add :final_blows, :integer, null: false, default: 0
      add :melee_final_blows, :integer, null: false, default: 0
      add :multikills, :integer, null: false, default: 0
      add :recon_assists, :integer, null: false, default: 0
      add :teleporter_pads_destroyed, :integer, null: false, default: 0
      add :shield_generators_destroyed, :integer, null: false, default: 0
      add :damage_blocked, :integer, null: false, default: 0
      add :melee_kills, :integer, null: false, default: 0
      add :weapon_accuracy_percentage, :integer, null: false, default: 0
      add :critical_hits_accuracy_percentage, :integer, null: false, default: 0
      add :turrets_destroyed, :integer, null: false, default: 0
      add :defensive_assists, :integer, null: false, default: 0
      add :offensive_assists, :integer, null: false, default: 0
      add :barrier_damage_done, :integer, null: false, default: 0
      add :hero_damage_done, :integer, null: false, default: 0
      add :scoped_accuracy_percentage, :integer, null: false, default: 0
      add :self_healing, :integer, null: false, default: 0
      add :damage_amplified, :integer, null: false, default: 0
      add :critical_hits_kills, :integer, null: false, default: 0
      add :scoped_hits, :integer, null: false, default: 0
    end
  end
end
