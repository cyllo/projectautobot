defmodule Models.Statistics.CombatBest do
  use Models.Model
  alias Models.Statistics.CombatBest

  schema "combat_best_statistics" do
    field :eliminations_most_in_game, :integer
    field :critical_hits_most_in_game, :integer
    field :melee_final_blows_most_in_game, :integer
    field :defensive_assists_most_in_game, :integer
    field :offensive_assists_most_in_game, :integer
    field :final_blows_most_in_game, :integer
    field :solo_kills_most_in_game, :integer
    field :objective_kills_most_in_game, :integer
    field :objective_time_most_in_game, :integer
    field :time_spent_on_fire_most_in_game, :integer
    field :healing_done_most_in_game, :integer
    field :turrets_destroyed_most_in_game, :integer
    field :self_healing_most_in_game, :integer
    field :recon_assists_most_in_game, :integer
    field :damage_blocked_most_in_game, :integer
    field :melee_kills_most_in_game, :integer
    field :environmental_kills_most_in_game, :integer
    field :teleporter_pads_destroyed_most_in_game, :integer
    field :shield_generators_destroyed_most_in_game, :integer
    field :hero_damage_done_most_in_game, :integer
    field :barrier_damage_done_most_in_game, :integer

    field :all_damage_done_most_in_game, :integer
    field :all_damage_done_most_in_life, :integer
    field :hero_damage_done_most_in_life, :integer
    field :critical_hits_most_in_life, :integer
    field :eliminations_most_in_life, :integer

    field :kill_streak_best, :integer
    field :multikill_best, :integer
    field :scoped_accuracy_best_in_game_percentage, :integer
    field :weapon_accuracy_best_in_game_percentage, :integer
  end

  @allowed_fields [
    :eliminations_most_in_game,
    :critical_hits_most_in_game,
    :melee_final_blows_most_in_game,
    :defensive_assists_most_in_game,
    :offensive_assists_most_in_game,
    :final_blows_most_in_game,
    :solo_kills_most_in_game,
    :objective_kills_most_in_game,
    :objective_time_most_in_game,
    :time_spent_on_fire_most_in_game,
    :healing_done_most_in_game,
    :turrets_destroyed_most_in_game,
    :self_healing_most_in_game,
    :recon_assists_most_in_game,
    :damage_blocked_most_in_game,
    :melee_kills_most_in_game,
    :environmental_kills_most_in_game,
    :teleporter_pads_destroyed_most_in_game,
    :shield_generators_destroyed_most_in_game,
    :hero_damage_done_most_in_game,
    :barrier_damage_done_most_in_game,
    :all_damage_done_most_in_game,
    :all_damage_done_most_in_life,
    :hero_damage_done_most_in_life,
    :critical_hits_most_in_life,
    :eliminations_most_in_life,
    :kill_streak_best,
    :multikill_best,
    :scoped_accuracy_best_in_game_percentage,
    :weapon_accuracy_best_in_game_percentage
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%CombatBest{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
  end

  def create_changeset(params), do: changeset(%CombatBest{}, params)
end
