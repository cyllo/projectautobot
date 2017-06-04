defmodule Api.Schema.HeroStatisticsAggregateTypes do
  use Absinthe.Schema.Notation

  @desc "Global stats for playable heroes"
  object :hero_statistics_aggregate do
    field :hero, :hero

    field :combat_best_statistic, :combat_best_statistic
    field :combat_average_statistic, :combat_average_statistic
    field :combat_lifetime_statistic, :combat_lifetime_statistic
    field :hero_specific_statistic, :hero_specific_statistic
    field :match_awards_statistic, :match_awards_statistic
    field :game_history_statistic, :game_history_statistic
  end
end
