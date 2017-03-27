defmodule Scraper.ModelCreator.Heroes do
  alias Models.Game
  alias Scraper.Helpers

  def get_new_heroes_from_stats(heroes_stats1, heroes_stats2) do
    Helpers.uniq_list(get_hero_names_from_stats(heroes_stats1), get_hero_names_from_stats(heroes_stats2))
      |> filter_and_store_heroes
  end

  def get_new_heroes_from_stats(heroes_stats) do
    heroes_stats
      |> get_hero_names_from_stats
      |> filter_and_store_heroes
  end

  defp filter_and_store_heroes(heroes_list) do
    heroes_list
      |> Enum.to_list
      |> Enum.filter(&is_not_in_cache?/1)
      |> store_heroes_into_db
  end

  defp store_heroes_into_db(heroes) do
    if length(heroes) >= 1 do
      with {:ok, res} <- Game.create_heroes(heroes) do
        get_hero_names(heroes)
          |> add_hero_names_to_cache

        {:ok, res}
      end
    else
      {:ok, "no heroes to store"}
    end
  end

  defp add_hero_names_to_cache(hero_names) do
    hero_cache_length = hero_cache_length()

    cond do
      hero_names > 0 && hero_cache_length > 0 ->
        Helpers.uniq_list(heroes_cache(), hero_names)
          |> put_heroes_cache

      hero_names > 0 ->
        put_heroes_cache(hero_names)
    end
  end

  defp is_not_in_cache?(%{name: name}) do
    if (heroes_cache()) do
      !String.contains?(name, heroes_cache())
    else
      true
    end
  end

  defp hero_cache_length, do: if (heroes_cache()), do: length(heroes_cache()), else: 0
  defp heroes_cache, do: ConCache.get(:scraper_store, :heroes_store)
  defp put_heroes_cache(val), do: ConCache.put(:scraper_store, :heroes_store, val)
  defp get_hero_names_from_stats(heroes_stats), do: Enum.map(heroes_stats, &create_hero_stat/1)
  defp create_hero_stat(hero), do: %{name: hero.name, code: hero.code}
  defp get_hero_names(heroes), do: Enum.map(heroes, fn(hero) -> Map.get(hero, :name) end)
end
