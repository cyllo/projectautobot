defmodule Api.HeroGlobalAggregateResolver do
  alias Models.Game

  def find_hero_and_agregate(%{name: name}, _info) do
    with {:ok, hero} <- Game.find_hero(name: name) do
      {:ok, hero}
    end
  end

  def find_hero_and_agregate(%{hero_id: id} = params, _info) do
    case Models.Statistics.Snapshots.LatestSnapshotStatistic.get_hero_aggregate(id, Map.to_list(params)) do
      nil -> {:error, "No hero found with id #{id}"}
      hero -> {:ok, hero}
    end
  end
end
