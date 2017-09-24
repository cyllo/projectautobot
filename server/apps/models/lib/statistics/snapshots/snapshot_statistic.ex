defmodule Models.Statistics.Snapshots.SnapshotStatistic do
  use Models.Model
  alias Models.Statistics.Snapshots.{HeroSnapshotStatistic, SnapshotStatistic}
  alias Models.Statistics.MatchAward

  schema "snapshot_statistics" do
    belongs_to :gamer_tag, Models.Game.GamerTag
    has_many :hero_snapshot_statistics, Models.Statistics.Snapshots.HeroSnapshotStatistic
    has_one :profile_snapshot_statistic, Models.Statistics.Snapshots.ProfileSnapshotStatistic

    timestamps(type: :utc_datetime)
  end

  @required_fields [:gamer_tag_id]
  @total_stats_types [:hero_total_competitive, :hero_total_quickplay]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%SnapshotStatistic{} = struct, params \\ %{}) do
    struct
      |> cast(params, @required_fields)
      |> validate_required(@required_fields)
      |> cast_assoc(:gamer_tag)
  end

  def create_changeset(params), do: changeset(%SnapshotStatistic{}, params)

  def latest_stats_query do
    query = from(ss in SnapshotStatistic, order_by: [desc: :inserted_at],
                                          distinct: ss.gamer_tag_id)

    from(q in subquery(query), order_by: [asc: :inserted_at])
  end

  def latest_stats_query(limit) do
    query = from(ss in SnapshotStatistic, order_by: [desc: :inserted_at],
                                          limit: ^limit,
                                          distinct: ss.gamer_tag_id)

    from(q in subquery(query), order_by: [asc: :inserted_at])
  end

  def latest_10_min_intervals(query \\ SnapshotStatistic) do
    # from(query, )
  end

  def latest_daily_query(query \\ SnapshotStatistic) do
    from(query, distinct: fragment("inserted_at::date"),
                order_by: fragment("inserted_at::date DESC, inserted_at DESC"))
  end

  def latest_total_medals(gamer_tag_id) do
    from(ss in SnapshotStatistic,
      where: ss.gamer_tag_id == ^gamer_tag_id,
      inner_join: hss in HeroSnapshotStatistic,
      on: ss.id == hss.snapshot_statistic_id,
      where: hss.statistic_type in ^@total_stats_types,
      inner_join: ma in MatchAward,
      on: ma.id == hss.match_awards_statistic_id,
      select: {hss.statistic_type, ma.total_medals})
  end

  def preload_statistics_query(query) do
    preload(query,
      profile_snapshot_statistic: [:profile_statistic],
      hero_snapshot_statistics: [
        :hero_specific_statistic,
        :hero, :game_average_statistic,
        :combat_best_statistic, :match_awards_statistic,
        :combat_lifetime_statistic, :game_history_statistic
      ]
    )
  end
end
