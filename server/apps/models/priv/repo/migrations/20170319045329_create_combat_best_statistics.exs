defmodule Models.Repo.Migrations.CreateCombatBestStatistics do
  use Ecto.Migration

  def change do
    create table(:combat_best_statistics) do
      add :eliminations_most_in_life, :integer, null: false, default: 0
      add :eliminations_most_in_game, :integer, null: false, default: 0

      add :critical_hits_most_in_game, :integer, null: false, default: 0
      add :critical_hits_most_in_life, :integer, null: false, default: 0

      add :melee_final_blows_most_in_game, :integer, null: false, default: 0

      add :weapon_accuracy_best_in_game_percentage, :integer, null: false, default: 0

      add :multikill_best, :integer, null: false, default: 0
      add :kill_streak_best, :integer, null: false, default: 0
      add :scoped_accuracy_best_in_game_percentage, :integer, null: false, default: 0

      add :environmental_kills_most_in_game, :integer, null: false, default: 0
      add :teleporter_pads_destroyed_most_in_game, :integer, null: false, default: 0
      add :turrets_destroyed_most_in_game, :integer, null: false, default: 0
      add :shield_generators_destroyed_most_in_game, :integer, null: false, default: 0

      add :defensive_assists_most_in_game, :integer, null: false, default: 0
      add :offensive_assists_most_in_game, :integer, null: false, default: 0

      add :final_blows_most_in_game, :integer, null: false, default: 0

      add :solo_kills_most_in_game, :integer, null: false, default: 0

      add :objective_kills_most_in_game, :integer, null: false, default: 0

      add :objective_time_most_in_game, :integer, null: false, default: 0

      add :time_spent_on_fire_most_in_game, :integer, null: false, default: 0

      add :healing_done_most_in_game, :integer, null: false, default: 0
      add :self_healing_most_in_game, :integer, null: false, default: 0


      add :recon_assists_most_in_game, :integer, null: false, default: 0

      add :damage_blocked_most_in_game, :integer, null: false, default: 0
      add :melee_kills_most_in_game, :integer, null: false, default: 0

      add :all_damage_done_most_in_game, :integer, null: false, default: 0
      add :all_damage_done_most_in_life, :integer, null: false, default: 0

      add :hero_damage_done_most_in_game, :integer, null: false, default: 0
      add :barrier_damage_done_most_in_game, :integer, null: false, default: 0
      add :hero_damage_done_most_in_life, :integer, null: false, default: 0
    end
  end
end
