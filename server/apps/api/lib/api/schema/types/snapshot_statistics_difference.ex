defmodule Api.Schema.SnapshotStatisticsDifferenceTypes do
  use Absinthe.Schema.Notation

  object :snapshot_statistic_difference do
    field :profile_snapshot_statistic, :profile_snapshot_statistic_difference
    field :hero_snapshot_statistics, :hero_snapshot_statistics_difference
  end

  object :profile_snapshot_statistic_difference do
    field :profile_statistic, :profile_statistic_difference
  end

  object :profile_statistic_difference do
    field :competitive_level, :integer
    field :level, :integer
    field :total_games_won, :integer
  end

  object :hero_snapshot_statistics_difference do
    @desc "Contains a map of hero id to stats differences"
    field :hero_competitive, :map

    @desc "Contains a map of hero id to stats differences"
    field :hero_quickplay , :map

    @desc "Contains a map of stats differences"
    field :hero_total_competitive, :map

    @desc "Contains a map of stats differences"
    field :hero_total_quickplay, :map
  end
end
