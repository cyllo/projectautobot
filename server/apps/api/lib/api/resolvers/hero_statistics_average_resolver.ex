defmodule Api.HeroStatisticsAverageResolver do
  # alias Models.Game

  # def find_hero_and_average(%{name: name}, _info) do
  #   with {:ok, hero} <- Game.find_hero(name: name) do
  #     {:ok, hero}
  #   end
  # end

  def find_hero_and_average(%{hero_id: hero_id, type: type} = params, _info) do
    case Models.Statistics.Snapshots.hero_average(hero_id, type) do
      nil -> {:error, "No hero found with id #{hero_id}"}
      hero -> {:ok, hero}
    end
  end
end
