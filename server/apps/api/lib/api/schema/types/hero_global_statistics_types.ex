defmodule Api.Schema.HeroGlobalStatisticsTypes do
  use Absinthe.Schema.Notation

  @desc "Global stats for playable heroes"
  object :hero_global_statistics do
    field :hero, :hero
  end
end
