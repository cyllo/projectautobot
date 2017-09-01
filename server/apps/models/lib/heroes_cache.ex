defmodule Models.HeroesCache do
  alias Models.{HeroesCache, Game}
  import Logger, only: [info: 1]

  def is_not_in_cache?(%{name: name}) do
    if cache() do
      !Map.has_key?(cache(), name)
    else
      true
    end
  end

  def put(heroes) do
    ConCache.put(:models_store, :heroes_store, heroes_name_map(heroes))

    heroes
  end

  def store_heroes_into_db(heroes) do
    if length(heroes) >= 1 do
      with {:ok, res} <- Game.create_heroes(heroes) do
        add_heroes_to_cache(res)

        {:ok, res}
      else
        {:error, "heroes already saved"} -> Game.get_all_heroes |> HeroesCache.put
      end
    else
      {:ok, HeroesCache.cache_list()}
    end
  end

  def add_heroes_to_cache(heroes) do

    cache_length = HeroesCache.cache_length()
    hero_names = get_hero_names(heroes)

    cond do
      length(hero_names) <= 0 -> heroes

      cache_length > 0 ->
        new_hero_names = get_new_hero_names(hero_names)

        if Enum.any?(new_hero_names) do
          info "Adding to hero cache #{inspect new_hero_names}"

          HeroesCache.put(heroes ++ HeroesCache.cache_list())
        else
          heroes_name_map(heroes)
        end

      cache_length <= 0 ->
        info "Creating hero cache #{inspect Utility.pluck(heroes, :name)}"

        HeroesCache.put(heroes)
    end
  end

  def get_hero_id_by_name(hero_name) do
    case get_by_name(hero_name) do
      nil -> nil
      hero -> Map.get(hero, :id)
    end
  end

  def get_by_name(hero_name), do: Map.get(cache(), hero_name)
  def filter_not_in_cache(heroes), do: Enum.filter(heroes, &is_not_in_cache?/1)
  def cache_length, do: if (cache()), do: cache() |> Map.keys |> length, else: 0
  def cache, do: ConCache.get(:models_store, :heroes_store) || %{}
  def cache_names, do: Map.keys(cache())
  def cache_list, do: Map.values(cache())

  defp get_new_hero_names(hero_names), do: Utility.difference(hero_names, HeroesCache.cache_names()) |> Utility.difference(HeroesCache.cache_names())
  defp heroes_name_map(heroes), do: Enum.reduce(heroes, %{}, fn(hero, acc) -> Map.put(acc, Map.get(hero, :name), hero) end)
  defp get_hero_names(heroes), do: Enum.map(heroes, fn(hero) -> Map.get(hero, :name) end)
end
