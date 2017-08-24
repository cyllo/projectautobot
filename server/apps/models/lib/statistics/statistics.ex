defmodule Models.Statistics do
  require Models.Model

  alias Models.Model
  alias Models.Statistics.{CombatAverage, CombatBest, CombatLifetime, GameHistory, MatchAward, HeroSpecific, Profile}

  Model.create_model_methods(CombatAverage)
  Model.create_model_methods(CombatBest)
  Model.create_model_methods(CombatLifetime)
  Model.create_model_methods(MatchAward)
  Model.create_model_methods(GameHistory)
  Model.create_model_methods(HeroSpecific)
  Model.create_model_methods(Profile)
end
