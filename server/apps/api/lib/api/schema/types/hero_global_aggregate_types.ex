defmodule Api.Schema.HeroGlobalAggregateTypes do
  use Absinthe.Schema.Notation

  @desc "Global stats for playable heroes"
  object :hero_global_aggregate do
    field :hero, :hero
  end
end
