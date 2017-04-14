defmodule Models.Statistics do
  require Models.Model

  alias Models.{Repo, Model}
  alias Models.Statistics.{CombatAverage, CombatBest, CombatLifetime, GameHistory, MatchAward, HeroSpecific}

  Model.create_model_methods(CombatAverage)
  Model.create_model_methods(CombatBest)
  Model.create_model_methods(CombatLifetime)
  Model.create_model_methods(MatchAward)
  Model.create_model_methods(GameHistory)
  Model.create_model_methods(HeroSpecific)
end
