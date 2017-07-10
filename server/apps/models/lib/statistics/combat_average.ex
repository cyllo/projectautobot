defmodule Models.Statistics.CombatAverage do
  use Models.Model
  alias Models.Statistics.CombatAverage

  schema "combat_average_statistics" do
    field :critical_hits_average, :decimal
    field :damage_done_average, :decimal
    field :deaths_average, :decimal
    field :defensive_assists_average, :decimal
    field :eliminations_average, :decimal
    field :final_blows_average, :decimal
    field :healing_done_average, :decimal
    field :melee_final_blows_average, :decimal
    field :objective_kills_average, :decimal
    field :objective_time_average, :integer
    field :offensive_assists_average, :integer
    field :self_healing_average, :decimal
    field :solo_kills_average, :decimal
    field :time_spent_on_fire_average, :integer
    field :damage_blocked_average, :integer
    field :melee_kills_average, :decimal
    field :all_damage_done_avg_per_10_min, :integer
  end

  @allowed_fields [
    :critical_hits_average,
    :damage_done_average,
    :deaths_average,
    :defensive_assists_average,
    :eliminations_average,
    :final_blows_average,
    :healing_done_average,
    :melee_final_blows_average,
    :objective_kills_average,
    :objective_time_average,
    :offensive_assists_average,
    :self_healing_average,
    :solo_kills_average,
    :time_spent_on_fire_average,
    :damage_blocked_average,
    :melee_kills_average
    # :all_damage_done_avg_per_10_min
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%CombatAverage{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
  end

  def create_changeset(params), do: changeset(%CombatAverage{}, params)
end
