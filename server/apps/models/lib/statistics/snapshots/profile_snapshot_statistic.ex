defmodule Models.Statistics.Snapshots.ProfileSnapshotStatistic do
  use Models.Model

  alias Models.Statistics.Profile
  alias Models.Statistics.Snapshots.{
    SnapshotStatistic, StatisticsAveragesSnapshot,
    ProfileSnapshotStatistic, LeaderboardSnapshotStatistic
  }

  schema "profile_snapshot_statistics" do
    belongs_to :snapshot_statistic, SnapshotStatistic
    belongs_to :profile_statistic, Profile
    belongs_to :leaderboard_snapshot_statistic, LeaderboardSnapshotStatistic
    belongs_to :statistics_averages_snapshot, StatisticsAveragesSnapshot
  end

  @required_fields [:snapshot_statistic_id, :profile_statistic_id]
  @available_fields @required_fields ++ [:leaderboard_snapshot_statistic_id, :statistics_averages_snapshot_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%ProfileSnapshotStatistic{} = struct, params \\ %{}) do
    struct
      |> cast(params, @available_fields)
      |> validate_required(@required_fields)
  end

  def create_changeset(params), do: changeset(%ProfileSnapshotStatistic{}, params)
end
