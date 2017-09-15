defmodule Models.Statistics.GameAverage do
  use Models.Model
  alias Models.Statistics.GameAverage

  schema "game_average_statistics" do
    field :solo_kills_avg_per10_min, :decimal
    field :defensive_assists_avg_per10_min, :decimal
    field :time_spent_on_fire_avg_per10_min, :decimal
    field :objective_time_avg_per10_min, :decimal
    field :deaths_avg_per10_min, :decimal
    field :self_healing_avg_per10_min, :decimal
    field :offensive_assists_avg_per10_min, :decimal
    field :final_blows_avg_per10_min, :decimal
    field :critical_hits_avg_per10_min, :decimal
    field :eliminations_avg_per10_min, :decimal
    field :damage_blocked_avg_per10_min, :decimal
    field :hero_damage_done_avg_per10_min, :decimal
    field :barrier_damage_done_avg_per10_min, :decimal
    field :healing_done_avg_per10_min, :decimal
    field :all_damage_done_avg_per10_min, :decimal
    field :objective_kills_avg_per10_min, :decimal
    field :melee_final_blows_avg_per10_min, :decimal
    field :damage_amplified_avg_per10_min, :decimal
  end

  @allowed_fields [
    :solo_kills_avg_per10_min,
    :defensive_assists_avg_per10_min,
    :time_spent_on_fire_avg_per10_min,
    :objective_time_avg_per10_min,
    :deaths_avg_per10_min,
    :self_healing_avg_per10_min,
    :offensive_assists_avg_per10_min,
    :final_blows_avg_per10_min,
    :critical_hits_avg_per10_min,
    :eliminations_avg_per10_min,
    :damage_blocked_avg_per10_min,
    :hero_damage_done_avg_per10_min,
    :barrier_damage_done_avg_per10_min,
    :healing_done_avg_per10_min,
    :all_damage_done_avg_per10_min,
    :objective_kills_avg_per10_min,
    :melee_final_blows_avg_per10_min,
    :damage_amplified_avg_per10_min
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%GameAverage{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
  end

  def create_changeset(params), do: changeset(%GameAverage{}, params)
end
