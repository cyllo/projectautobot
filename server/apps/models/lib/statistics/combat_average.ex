defmodule Models.Statistics.CombatAverage do
  use Models.Model

  schema "combat_average_statistics" do
    field :offensive_assists_average, :integer
    field :self_healing_average, :decimal
    field :solo_kills_average, :decimal
    field :eliminations_average, :decimal
    field :time_spent_on_file_average, :integer
    field :deaths_average, :decimal
    field :damage_done_average, :integer
    field :objective_time_average, :integer
    field :objective_kills_average, :decimal
    field :healing_done_average, :decimal
    field :final_blows_average, :decimal
    field :melee_final_blows_average, :decimal
  end
end
