defmodule Models.Statistics.CombatBest do
  use Models.Model
  alias Models.Statistics.CombatBest

  schema "combat_best_statistics" do
    field :eliminations_most_in_life, :integer
    field :eliminations_most_in_game, :integer

    field :critical_hits_most_in_game, :integer
    field :critical_hits_most_in_life, :integer

    field :damage_done_most_in_game, :integer
    field :damage_done_most_in_life, :integer

    field :melee_final_blows_most_in_game, :integer

    field :weapon_accuracy_best_in_game_percentage, :integer

    field :kill_streak_best, :integer

    field :defensive_assists_most_in_game, :integer
    field :offensive_assists_most_in_game, :integer

    field :final_blows_most_in_game, :integer

    field :solo_kills_most_in_game, :integer

    field :objective_kills_most_in_game, :integer

    field :objective_time_most_in_game, :integer

    field :time_spent_on_fire_most_in_game, :integer

    field :healing_done_most_in_game, :integer
    field :healing_done_most_in_life, :integer
    field :self_healing_most_in_game, :integer

    field :multikill_best, :integer
    field :recon_assists_most_in_game, :integer

    field :damage_blocked_most_in_game, :integer
    field :melee_kills_most_in_game, :integer
  end

  @allowed_fields [
    :eliminations_most_in_life,
    :eliminations_most_in_game,
    :critical_hits_most_in_game,
    :critical_hits_most_in_life,
    :damage_done_most_in_game,
    :damage_done_most_in_life,
    :melee_final_blows_most_in_game,
    :weapon_accuracy_best_in_game_percentage,
    :kill_streak_best,
    :defensive_assists_most_in_game,
    :offensive_assists_most_in_game,
    :final_blows_most_in_game,
    :solo_kills_most_in_game,
    :objective_kills_most_in_game,
    :objective_time_most_in_game,
    :time_spent_on_fire_most_in_game,
    :healing_done_most_in_game,
    :healing_done_most_in_life,
    :self_healing_most_in_game,
    :multikill_best,
    :recon_assists_most_in_game,
    :damage_blocked_most_in_game,
    :melee_kills_most_in_game
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
