defmodule Models.Statistics.Snapshots.AllHeroes do
  use Models.Model
  alias Models.Statistics.Snapshots.AllHeroes

  schema "all_heroes_snapshot_statistics" do
    belongs_to :snapshot_statistic, Models.Statistics.Snapshot
    belongs_to :combat_best_statistic, Models.Statistics.CombatBest
    belongs_to :combat_average_statistic, Models.Statistics.CombatAverage
    belongs_to :combat_lifetime_statistic, Models.Statistics.CombatLifetime
    belongs_to :match_awards_statistic, Models.Statistics.MatchAwards
    belongs_to :game_history_statistic, Models.Statistics.GameHistory
  end

  @required_fields [
    :snapshot_statistic_id,
    :combat_best_statistic_id,
    :combat_average_statistic_id,
    :combat_lifetime_statistic_id,
    :match_awards_statistic_id,
    :game_history_statistic_id
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%AllHeroes{} = struct, params \\ %{}) do
    struct
      |> cast(params, @required_fields)
      |> validate_required(@required_fields)
  end

  def create_changeset(params), do: changeset(%AllHeroes{}, params)
end
