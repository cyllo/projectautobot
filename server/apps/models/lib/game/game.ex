defmodule Models.Game do
  use Models.Model

  require IEx
  alias Models.Game.{Hero, GamerTag}
  alias Models.{Repo, Model}

  Model.create_model_methods(Hero)
  Model.create_model_methods(GamerTag)

  def get_all_gamer_tags, do: Repo.all(GamerTag)
  def get_all_gamer_tags(params), do: from(gt in GamerTag, where: ^params) |> Repo.all
  def get_all_heroes, do: Repo.all(Hero)
  def get_all_heroes(params), do: from(gt in Hero, where: ^params) |> Repo.all

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

  defp add_timestamps(hero) do
    Map.put(hero, :inserted_at, NaiveDateTime.utc_now)
      |> Map.put(:updated_at, NaiveDateTime.utc_now)
  end
end
