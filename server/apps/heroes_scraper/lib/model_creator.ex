defmodule HeroesScraper.ModelCreator do
  import Logger, only: [info: 1]

  alias Models.{HeroesCache, Game, Game.Hero}

  def create_heroes(heroes) do
    current_heroes_map = HeroesCache.cache_db_heroes
      |> Utility.create_id_map(:name)

    {current_heroes, new_heroes} = heroes
      |> serialize_heroes
      |> Enum.map(&Map.get(current_heroes_map, &1.name, &1))
      |> Enum.split_with(&Map.has_key?(&1, :id))

    if Enum.any?(new_heroes) do
      info "New heroes were found: #{new_heroes |> Utility.pluck(:name) |> inspect}"

      with {:ok, heroes} <- Game.create_heroes(new_heroes) do
        HeroesCache.add_heroes_to_cache(heroes)

        Enum.concat(heroes, current_heroes)
      end
    else
      update_any_changed_heroes(heroes, current_heroes)
    end
  end

  defp update_any_changed_heroes(new_heroes, current_heroes) do
    hero_name_map = Utility.create_id_map(new_heroes, :name)

    {unchanged_heroes, changed_heroes} = current_heroes
      |> Enum.split_with(&heroes_equal(&1, hero_name_map[&1.name]))

    if Enum.any?(changed_heroes) do
      changed_heroes
        |> Enum.map(&{&1.id, Hero.changeset(&1, hero_fields(hero_name_map[&1.name]))})
        |> Enum.map(fn {id, hero} -> Game.update_hero(id, hero) end)
        |> Enum.map(fn {:ok, hero} -> hero end)
        |> Enum.concat(unchanged_heroes)
    else
      unchanged_heroes
    end
  end

  defp hero_fields(hero), do: Map.take(hero,  Hero.__schema__(:fields) -- [:id])
  defp heroes_equal(a, b) do
    Map.equal?(Map.take(a, [:name, :description]), Map.take(b, [:name, :description]))
  end

  defp serialize_heroes(heroes) do
    Enum.map(heroes, fn hero ->
      hero
        |> put_role
        |> Map.take([:role, :role_id, :name, :description, :select_portrait_url, :skills])
    end)
  end

  defp put_role(hero) do
    with {:ok, role} <- Game.find_hero_role(name: hero.role) do
      hero
        |> Map.delete(:role)
        |> Map.put(:role_id, role.id)
    else
      {:error, _} ->
        Map.put(hero, :role, serialize_role(hero))
    end
  end

  defp serialize_role(%{role_svg_url: svg_url, role: name}) do
    %{svg_url: svg_url, name: name}
  end
end
