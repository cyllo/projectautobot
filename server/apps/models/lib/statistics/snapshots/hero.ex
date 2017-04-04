defmodule Models.Statistics.Snapshots.Hero do
  use Models.Model
  alias Models.Statistics.Snapshots.Hero

  schema "hero_snapshot_statistics" do
    belongs_to :hero, Models.Game.Hero
    belongs_to :snapshot_statistic, Models.Statistics.Snapshot
    belongs_to :combat_average_statistic, Models.Statistics.CombatAverage
    belongs_to :combat_best_statistic, Models.Statistics.CombatBest
    belongs_to :combat_lifetime_statistic, Models.Statistics.CombatLifetime
    belongs_to :game_history_statistic, Models.Statistics.GameHistory
    belongs_to :hero_specific_statistic, Models.Statistics.HeroSpecific
    belongs_to :match_awards_statistic, Models.Statistics.MatchAwards
  end

  @required_fields [
    :combat_average_statistic_id, :combat_best_statistic_id,
    :combat_lifetime_statistic_id, :game_history_statistic_id,
    :hero_specific_statistic_id, :match_awards_statistic_id,
    :snapshot_statistic_id, :hero_id
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Hero{} = struct, params \\ %{}) do
    struct
      |> cast(params, @required_fields)
      |> validate_required(@required_fields)
  end

  def create_changeset(params), do: changeset(%Hero{}, params)
end
