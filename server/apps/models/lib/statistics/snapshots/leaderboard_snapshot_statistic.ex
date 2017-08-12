defmodule Models.Statistics.Snapshots.LeaderboardSnapshotStatistic do
  use Models.Model
  alias Models.Statistics.Snapshots.{LeaderboardSnapshotStatistic, SnapshotStatistic}

  schema "leaderboard_snapshot_statistics" do
    field :hero_total_competitive_rankings, :map
    field :hero_total_quickplay_rankings, :map

    field :hero_competitive_rankings, :map
    field :hero_quickplay_rankings, :map

    field :profile_stats_rankings, :map

    timestamps(type: :utc_datetime)
  end

  @required_fields [
    :hero_total_competitive_rankings,
    :hero_total_quickplay_rankings,

    :hero_competitive_rankings,
    :hero_quickplay_rankings,

    :profile_stats_rankings
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%LeaderboardSnapshotStatistic{} = struct, params \\ %{}) do
    struct
      |> cast(params, @required_fields)
      |> validate_required(@required_fields)
  end

  def create_changeset(params), do: changeset(%LeaderboardSnapshotStatistic{}, params)

  def latest_snapshot_query(query \\ from(LeaderboardSnapshotStatistic)) do
    query
      |> order_by([desc: :inserted_at])
      |> limit(1)
  end
end
