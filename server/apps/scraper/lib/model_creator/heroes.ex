defmodule Scraper.ModelCreator.Heroes do
  alias Models.{Game, HeroesCache}
  alias Scraper.Helpers

  def create_from_stats(%{competitive: competitive, quickplay: quickplay}) do
    %{heroes_stats: competitive_heroes_stats} = competitive
    %{heroes_stats: quickplay_heroes_stats} = quickplay

    get_new_heroes_from_stats(competitive_heroes_stats, quickplay_heroes_stats)
      |> HeroesCache.filter_not_in_cache
      |> HeroesCache.store_heroes_into_db
  end

  defp get_new_heroes_from_stats(heroes_stats1, heroes_stats2) do
    Helpers.uniq_list(
      create_hero_struct(heroes_stats1),
      create_hero_struct(heroes_stats2)
    )
  end

  defp create_hero_struct(heroes_stats), do: Enum.map(heroes_stats, &create_hero_stat/1)
  defp create_hero_stat(hero), do: %{name: hero.name, code: hero.code}
end
