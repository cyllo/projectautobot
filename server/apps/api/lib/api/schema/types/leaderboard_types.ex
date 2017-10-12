defmodule Api.Schema.LeaderboardSnapshotStatisticTypes do
  use Absinthe.Schema.Notation

  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]

  @desc """
    Leaderboard snapshot statistics is a object that contains the stat rankings
    for various stats. They can be accessed with the name (profile_stats_ranking/hero_competitive_rankings) and then you use the stat_name
    followed by the gamer_tag_id to find someones rank

    EG
      profile_stats_rankings[competitiveLevel][gamerTagId5] // {rank: 10, value: 43}
      hero_competitive_rankings[heroId][critical_hits_avg_per_10_min][gamerTagId] // {rank: 20, value: 32}
  """
  object :leaderboard_snapshot_statistic do
    field :id, :integer

    field :hero_total_competitive_rankings, :map
    field :hero_total_quickplay_rankings, :map

    field :hero_competitive_rankings, :map
    field :hero_quickplay_rankings, :map

    field :profile_stats_rankings, :map

    timestamp_types
  end

  input_object :leaderboard_rank_by_input do
    field :platform, :string
    field :region, :string
  end

  input_object :leaderboard_filters_input do
    field :statistics_props, list_of(non_null(:string))
    field :gamer_tag_id, :integer
    field :rank_by, :leaderboard_rank_by_input
  end
end
