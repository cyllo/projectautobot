defmodule Models.Game do
  use Models.Model
  require IEx
  alias Models.Game.{Hero, GamerTag}
  alias Models.Repo

  def get_all_gamer_tags, do: Repo.all(GamerTag)
  def get_all_gamer_tags(params), do: from(gt in GamerTag, where: ^params) |> Repo.all
  def get_all_heroes, do: Repo.all(Hero)
  def get_all_heroes_by_ids(hero_ids), do: from(h in Hero, or_where: h.id in ^hero_ids) |> Repo.all

  def get_hero(hero_id) do
    case Repo.get(Hero, hero_id) do
      nil -> {:error, "no entries found for #{hero_id}"}
      hero -> {:ok, hero}
    end
  end

  def create_hero(name, code) do
    Hero.create_changeset(%{name: name, code: code})
      |> Repo.insert
  end

  def create_heroes(heroes) do
    heroes = heroes
      |> Enum.map(&add_timestamps/1)

    try do
      {_, res} = Repo.insert_all(Hero, heroes, returning: true)

      {:ok, res}
    rescue
      Postgrex.Error ->
        {:error, "heroes already saved"}
    end
  end

  def create_or_get_gamer_tag(params) do
    params
      |> GamerTag.create_changeset
      |> Repo.insert
  end

  def find_gamer_tag(params) when is_map(params), do: params |> Map.to_list |> find_gamer_tag
  def find_gamer_tag(params) when is_list(params) and length(params) <= 0, do: {:error, "no params given for find"}
  def find_gamer_tag(params) when is_list(params) do
    case params && Repo.get_by(GamerTag, params) do
      nil -> {:error, "where #{inspect(params)} not found"}
      user -> {:ok, user}
    end
  end

  defp add_timestamps(hero) do
    Map.put(hero, :inserted_at, NaiveDateTime.utc_now)
      |> Map.put(:updated_at, NaiveDateTime.utc_now)
  end
end
