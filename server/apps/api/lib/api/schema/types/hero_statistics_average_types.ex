defmodule Api.Schema.HeroStatisticsAverageTypes do
  use Absinthe.Schema.Notation

  @desc "Average stats for playable heroes"
  object :hero_statistics_aggregate_average do
    field :hero, :hero
    field :hero_id, :integer

    field :combat_best_statistic, :combat_best_statistic_average
    field :game_average_statistic, :game_average_statistic_average
    field :combat_lifetime_statistic, :combat_lifetime_statistic_average
    field :hero_specific_statistic, :hero_specific_statistic_average
    field :match_awards_statistic, :match_awards_statistic_average
    field :game_history_statistic, :game_history_statistic_average
  end
end
