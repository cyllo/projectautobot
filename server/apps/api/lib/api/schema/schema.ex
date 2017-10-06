defmodule Api.Schema do
  use Absinthe.Schema
  alias Api.{Middleware, Schema}
  alias Api.Schema.{Queries, Mutations}

  import_types Absinthe.Type.Custom
  import_types Schema.ScalarTypes
  import_types Schema.AccountTypes
  import_types Schema.GameTypes
  import_types Schema.BlogTypes
  import_types Schema.SnapshotTypes
  import_types Schema.StatisticTypes
  import_types Schema.SessionTypes
  import_types Schema.StatisticAverageTypes
  import_types Schema.HeroStatisticsAverageTypes
  import_types Schema.LeaderboardSnapshotStatisticTypes
  import_types Schema.SnapshotStatisticsAverageTypes
  import_types Schema.ActionTypes
  import_types Schema.FriendTypes
  import_types Schema.SnapshotStatisticsDifferenceTypes

  import_types Queries.UserQueries
  import_types Queries.StatisticAveragesSnapshotQueries
  import_types Queries.SnapshotStatisticQueries
  import_types Queries.LeaderboardQueries
  import_types Queries.HeroQueries
  import_types Queries.GamerTagQueries
  import_types Queries.BlogQueries
  import_types Queries.AggregateAverageQueries

  import_types Mutations.UserMutations
  import_types Mutations.GamerTagMutations
  import_types Mutations.FriendshipMutations
  import_types Mutations.UserFriendGroupMutations
  import_types Mutations.BlogMutations

  query do
    import_fields :user_queries
    import_fields :statistic_averages_snapshot_queries
    import_fields :snapshot_statistic_queries
    import_fields :leaderboard_queries
    import_fields :hero_queries
    import_fields :gamer_tag_queries
    import_fields :blog_queries
    import_fields :aggregate_average_queries
  end

  mutation do
    import_fields :user_mutations
    import_fields :gamer_tag_mutations
    import_fields :friendship_mutations
    import_fields :user_friend_group_mutations
    import_fields :blog_post_mutations
  end

  def middleware(middleware, _field, %{identifier: :mutation}) do
    middleware ++ [Middleware.ChangesetErrorFormatter]
  end

  def middleware(middleware, _, _) do
    middleware
  end
end
