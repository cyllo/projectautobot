defmodule Models.Statistics.CombatLifetime do
  use Models.Model

  schema "combat_lifetime_statistics" do
    field :solo_kills, :integer
    field :eliminations, :integer
    field :eliminations_per_life, :decimal
    field :time_spent_on_fire, :integer
    field :deaths, :integer
    field :objective_kills, :integer
    field :objective_time, :integer
    field :environmental_kills, :integer
    field :environmental_deaths, :integer
    field :damage_done, :integer
    field :shots_fired, :integer
    field :shots_hit, :integer
    field :critical_hits, :integer
    field :critical_hit_accuracy, :integer
    field :critical_hits_per_minute, :integer
    field :healing_done, :integer
    field :final_blows, :integer
    field :melee_final_blows, :integer
    field :multikill_best, :integer
    field :multikills, :integer
  end
end
