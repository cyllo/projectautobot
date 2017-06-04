defmodule Api.Schema.SnapshotStatisticsAverageTypes do
  use Absinthe.Schema.Notation

  @desc "Average stats for snapshots"
  object :snapshot_statistics_average do
    field :all_heroes_snapshot_statistics, :all_heroes_snapshot_statistics_average
    field :hero_snapshot_statistics, list_of(:hero_snapshot_statistics_average)
  end

  object :all_heroes_snapshot_statistics_average do
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
