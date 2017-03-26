defmodule Models.Statistics.CombatBest do
  use Models.Model

  schema "combat_best_statistics" do
    field :eliminations_most_in_life, :integer
    field :eliminations_most_in_game, :integer

    field :critical_hits_most_in_game, :integer
    field :critical_hits_most_in_life, :integer

    field :damage_done_most_in_game, :integer
    field :damage_done_most_in_life, :integer

    field :melee_final_blows_most_in_game, :integer
    field :melee_final_blows_most_in_life, :integer

    field :final_blows_most_in_game, :integer

    field :solo_kills_most_in_game, :integer

    field :objective_kills_most_in_game, :integer

    field :objective_time_most_in_game, :integer

    field :time_spent_on_fire_most_in_game, :integer

    field :headling_done_most_in_game, :integer

    field :multi_kill_best, :integer
  end
end
