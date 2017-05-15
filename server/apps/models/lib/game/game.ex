defmodule Models.Game do
  use Models.Model
  alias Models.Game.{Hero, GamerTag}
  alias Models.{Repo, Model}

  @statistic_relations [
    :combat_average_statistic, :game_history_statistic,
    :combat_best_statistic, :combat_lifetime_statistic,
    :match_awards_statistic
  ]

  @all_heroes_snapshot_relations @statistic_relations
  @hero_snapshot_relations [:hero, :hero_specific_statistic] ++ @statistic_relations

  Model.create_model_methods(Hero)
  Model.create_model_methods(GamerTag)

  def get_all_gamer_tags_by_tag(tag) do
    from(gt in GamerTag, where: gt.tag == ^tag or gt.tag == ^slug_gamer_tag(tag))
      |> Repo.all
  end

  def get_gamer_tag_with_snapshots(id) do
    get_gamer_tag(id, snapshot_statistics: [
      all_heroes_snapshot_statistics: @all_heroes_snapshot_relations,
      hero_snapshot_statistics: @hero_snapshot_relations
    ])
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

  def create_gamer_tag(params) do
    params
      |> GamerTag.create_changeset
      |> Repo.insert
  end

  defp add_timestamps(hero) do
    Map.put(hero, :inserted_at, NaiveDateTime.utc_now)
      |> Map.put(:updated_at, NaiveDateTime.utc_now)
  end

  defp slug_gamer_tag(gamer_tag), do: String.replace(~r/(.*)#(.*)/, gamer_tag, "\0-\1")
end
