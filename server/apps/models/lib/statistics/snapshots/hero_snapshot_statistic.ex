defmodule Models.Statistics.Snapshots.HeroStatistic do
  use Models.Model
  alias Models.Statistics.Snapshots.HeroStatistic

  schema "hero_snapshot_statistics" do
    field :statistic_type, HeroStatisticTypeEnum
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
    :statistic_type
  ]

  @available_fields Enum.concat(@required_fields, [
    :combat_average_statistic_id,
    :combat_best_statistic_id,
    :combat_lifetime_statistic_id,
    :hero_specific_statistic_id,
    :match_awards_statistic_id,
    :hero_id
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
  def create_changeset(params, type), do: params |> Map.put(:statistic_type, type) |> create_changeset

  @spec heroes_total_query(query :: Ecto.Query, type :: :competitive|:quickplay) :: Ecto.Query
  def heroes_total_query(query, type \\ :competitive) do
    where(query, statistic_type: ^Utility.join_atoms(:heroes_total, type))
  end

  @spec heroes_query(query :: Ecto.Query, type :: :competitive|:quickplay) :: Ecto.Query
  def heroes_query(query, type \\ :competitive) do
    where(query, statistic_type: ^Utility.join_atoms(:hero, type))
  end

  def take_snapshot_params(params) when is_list(params), do: Enum.map(params, &take_snapshot_params/1)
  def take_snapshot_params(params) do
    Map.take(params, [:hero, :statistic_type, :hero_id,
                      :snapshot_statistic_id, :combat_average_statistic_id,
                      :combat_best_statistic_id, :combat_lifetime_statistic_id,
                      :game_history_statistic_id, :hero_specific_statistic_id,
                      :match_awards_statistic_id])
  end
end
