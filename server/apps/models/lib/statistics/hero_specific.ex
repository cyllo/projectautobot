defmodule Models.Statistics.HeroSpecific do
  use Models.Model

  schema "hero_specific_statistics" do
    field :stats, :map
    belongs_to :hero, Modesl.Game.Hero
  end
end
