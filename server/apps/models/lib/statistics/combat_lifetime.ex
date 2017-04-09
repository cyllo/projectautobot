defmodule Models.Statistics.CombatLifetime do
  use Models.Model
  alias Models.Statistics.CombatLifetime

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
    field :healing_done, :integer
    field :final_blows, :integer
    field :melee_final_blows, :integer
    field :multikills, :integer
    field :recon_assists, :integer
    field :teleporter_pads_destroyed, :integer
    field :damage_blocked, :integer
    field :melee_kills, :integer
    field :weapon_accuracy_percentage, :integer
    field :critical_hits_accuracy_percentage, :integer
    field :multikill_best, :integer
    field :turrets_destroyed, :integer
    field :defensive_assists, :integer
    field :offensive_assists, :integer
  end

  @allowed_fields [
    :solo_kills,
    :eliminations,
    :eliminations_per_life,
    :time_spent_on_fire,
    :deaths,
    :objective_kills,
    :objective_time,
    :environmental_kills,
    :environmental_deaths,
    :damage_done,
    :shots_fired,
    :shots_hit,
    :critical_hits,
    :critical_hit_accuracy,
    :healing_done,
    :final_blows,
    :melee_final_blows,
    :multikills,
    :recon_assists,
    :teleporter_pads_destroyed,
    :damage_blocked,
    :melee_kills,
    :weapon_accuracy_percentage,
    :critical_hits_accuracy_percentage,
    :multikill_best,
    :turrets_destroyed,
    :defensive_assists,
    :offensive_assists
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%CombatLifetime{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
  end

  def create_changeset(params), do: changeset(%CombatLifetime{}, params)
end
