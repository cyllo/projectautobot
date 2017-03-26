defmodule Models.Statistics.Snapshot.Hero do
  use Models.Model

  schema "hero_snapshot_statistics" do
    belongs_to :hero, Models.Game.Hero
    belongs_to :snapshot_statistic, Models.Statistics.Snapshot
    belongs_to :combat_average_statistic, Models.Statistics.CombatAverage
    belongs_to :combat_best_statistic, Models.Statistics.CombatBest
    belongs_to :combat_lifetime_statistic, Models.Statistics.CombatLifetime
    belongs_to :game_history_statistic, Models.Statistics.GameHistory
    belongs_to :hero_specific_statistic, Models.Statistics.HeroSpecific
    belongs_to :match_awards_statistic, Models.Statistics.MatchAwards
  end
end
