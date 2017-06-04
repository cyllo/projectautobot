defmodule Api.Schema.HeroStatisticsAggregateTypes do
  use Absinthe.Schema.Notation

  @desc "Global stats for playable heroes"
  object :hero_statistics_aggregate do
    field :hero, :hero

    field :combat_best_statistic, :combat_best_statistic_aggregate
    field :combat_average_statistic, :combat_average_statistic_aggregate
    field :combat_lifetime_statistic, :combat_lifetime_statistic_aggregate
    field :hero_specific_statistic, :hero_specific_statistic_aggregate
    field :match_awards_statistic, :match_awards_statistic_aggregate
    field :game_history_statistic, :game_history_statistic_aggregate
  end
end
