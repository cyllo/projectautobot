defmodule Api.HeroStatisticsAverageResolver do
  # alias Models.Game

  # def find_hero_and_average(%{name: name}, _info) do
  #   with {:ok, hero} <- Game.find_hero(name: name) do
  #     {:ok, hero}
  #   end
  # end

  def find_hero_and_average(params, _info) do
    Models.Statistics.Snapshots.find_hero_and_average(params)
  end
end
