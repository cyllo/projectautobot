defmodule Models.Statistics.Snapshots.SnapshotStatistic do
  use Models.Model
  alias Models.Statistics.Snapshots.SnapshotStatistic

  schema "snapshot_statistics" do
    belongs_to :gamer_tag, Models.Game.GamerTag
    has_many :hero_snapshot_statistics, Models.Statistics.Snapshots.HeroStatistic

    timestamps(type: :utc_datetime)
  end

  @required_fields [:gamer_tag_id]

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
end
