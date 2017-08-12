defmodule Api.Schema.SnapshotStatisticsAverageTypes do
  use Absinthe.Schema.Notation

  object :statistics_averages_snapshot do
    field :id, :integer
    field :hero_total_competitive_averages, :map
    field :hero_total_quickplay_averages, :map
    field :hero_competitive_averages, :map
    field :hero_quickplay_averages, :map
  end

  @desc "Average stats for snapshots"
  object :snapshot_statistics_average do
    field :heroes_total_snapshot_statistic, :heroes_total_snapshot_statistic_average
    field :hero_snapshot_statistics, list_of(:hero_snapshot_statistics_average)
  end

  object :heroes_total_snapshot_statistic_average do
    field :combat_best_statistic, :combat_best_statistic_average
    field :combat_average_statistic, :combat_average_statistic_average
    field :combat_lifetime_statistic, :combat_lifetime_statistic_average
    field :match_awards_statistic, :match_awards_statistic_average
    field :game_history_statistic, :game_history_statistic_average
  end

  object :hero_snapshot_statistics_average do
    field :hero, :hero
    field :hero_specific_statistic, :hero_specific_statistic_average
    field :combat_best_statistic, :combat_best_statistic_average
    field :combat_average_statistic, :combat_average_statistic_average
    field :combat_lifetime_statistic, :combat_lifetime_statistic_average
    field :match_awards_statistic, :match_awards_statistic_average
    field :game_history_statistic, :game_history_statistic_average
  end
end
