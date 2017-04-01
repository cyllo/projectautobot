defmodule Models.Repo.Migrations.CreateCombatBestStatistics do
  use Ecto.Migration

  def change do
    create table(:combat_best_statistics) do
      add :eliminations_most_in_life, :integer
      add :eliminations_most_in_game, :integer

      add :critical_hits_most_in_game, :integer
      add :critical_hits_most_in_life, :integer

      add :damage_done_most_in_game, :integer
      add :damage_done_most_in_life, :integer

      add :melee_final_blows_most_in_game, :integer
      add :melee_final_blows_most_in_life, :integer

      add :final_blows_most_in_game, :integer

      add :solo_kills_most_in_game, :integer

      add :objective_kills_most_in_game, :integer

      add :objective_time_most_in_game, :integer

      add :time_spent_on_fire_most_in_game, :integer

      add :headling_done_most_in_game, :integer

      add :multi_kill_best, :integer
    end
  end
end
