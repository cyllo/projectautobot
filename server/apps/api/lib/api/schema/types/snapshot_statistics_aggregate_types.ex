defmodule Api.Schema.SnapshotStatisticsAggregateTypes do
  use Absinthe.Schema.Notation

  @desc "Global stats for playable heroes"
  object :snapshot_statistics_aggregate do
    field :all_heroes_snapshot_statistics, :all_heroes_snapshot_statistics_aggrigate
    field :hero_snapshot_statistics, list_of(:hero_snapshot_statistics_aggrigate)
  end

  object :all_heroes_snapshot_statistics_aggrigate do
    field :combat_best_statistic, :combat_best_statistic_aggregate
    field :combat_average_statistic, :combat_average_statistic_aggregate
    field :combat_lifetime_statistic, :combat_lifetime_statistic_aggregate
    field :match_awards_statistic, :match_awards_statistic_aggregate
    field :game_history_statistic, :game_history_statistic_aggregate
  end

  object :hero_snapshot_statistics_aggrigate do
    field :hero, :hero
    field :hero_specific_statistic, :hero_specific_statistic_aggregate
    field :combat_best_statistic, :combat_best_statistic_aggregate
    field :combat_average_statistic, :combat_average_statistic_aggregate
    field :combat_lifetime_statistic, :combat_lifetime_statistic_aggregate
    field :match_awards_statistic, :match_awards_statistic_aggregate
    field :game_history_statistic, :game_history_statistic_aggregate
  end
end
