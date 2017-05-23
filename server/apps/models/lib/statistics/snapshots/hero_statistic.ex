defmodule Models.Statistics.Snapshots.HeroStatistic do
  use Models.Model
  alias Models.Statistics.Snapshots.HeroStatistic

  schema "hero_snapshot_statistics" do
    belongs_to :hero, Models.Game.Hero
    belongs_to :snapshot_statistic, Models.Statistics.Snapshots.SnapshotStatistic
    belongs_to :combat_average_statistic, Models.Statistics.CombatAverage
    belongs_to :combat_best_statistic, Models.Statistics.CombatBest
    belongs_to :combat_lifetime_statistic, Models.Statistics.CombatLifetime
    belongs_to :game_history_statistic, Models.Statistics.GameHistory
    belongs_to :hero_specific_statistic, Models.Statistics.HeroSpecific
    belongs_to :match_awards_statistic, Models.Statistics.MatchAward
  end

  @required_fields [
    :game_history_statistic_id,
    :snapshot_statistic_id,
    :hero_id
  ]

  @available_fields Enum.concat(@required_fields, [
    :combat_average_statistic_id,
    :combat_best_statistic_id,
    :combat_lifetime_statistic_id,
    :hero_specific_statistic_id,
    :match_awards_statistic_id
  ])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%HeroStatistic{} = struct, params \\ %{}) do
    struct
      |> cast(params, @available_fields)
      |> validate_required(@required_fields)
  end

  def create_changeset(params), do: changeset(%HeroStatistic{}, params)
end
