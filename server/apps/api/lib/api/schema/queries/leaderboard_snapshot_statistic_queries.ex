defmodule Api.Schema.Queries.LeaderboardQueries do
  use Absinthe.Schema.Notation

  alias Api.LeaderboardSnapshotResolver

  object :leaderboard_queries do
    field :leaderboard_snapshot_statistics, list_of(:leaderboard_snapshot_statistic) do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime
      arg :filters, :leaderboard_filters_input

      resolve &LeaderboardSnapshotResolver.all/2
    end

    field :leaderboard_snapshot_statistic, :leaderboard_snapshot_statistic do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime
      arg :filters, :leaderboard_filters_input

      resolve &LeaderboardSnapshotResolver.find/2
    end
  end
end
