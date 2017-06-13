defmodule Models.Game do
  use Models.Model
  alias Models.Game.{Hero, GamerTag, ConnectedGamerTag}
  alias Models.{Repo, Model}

  @statistic_relations [
    :combat_average_statistic, :game_history_statistic,
    :combat_best_statistic, :combat_lifetime_statistic,
    :match_awards_statistic
  ]

  @all_heroes_snapshot_relations @statistic_relations
  @hero_snapshot_relations [:hero, :hero_specific_statistic] ++ @statistic_relations

  def find_gamer_tag(%{tag: tag, platform: platform, region: region}) do
    find_gamer_tag([tag: Models.Helpers.normalize_gamer_tag(tag), platform: platform, region: region])
  end

  def find_gamer_tag(%{tag: tag}) do
    find_gamer_tag([tag: Models.Helpers.normalize_gamer_tag(tag)])
  end

  Model.create_model_methods(Hero)
  Model.create_model_methods(GamerTag)
  Model.create_model_methods(ConnectedGamerTag)

  def get_connected_gamer_tags(gamer_tag) do
    from(cgt in ConnectedGamerTag, where: cgt.gamer_tag1_id == ^gamer_tag.id or
                                          cgt.gamer_tag2_id == ^gamer_tag.id,
                                   preload: [:gamer_tag2, :gamer_tag1])
      |> Repo.all
      |> Enum.map(fn connected_gamer_tag ->
        if (connected_gamer_tag.gamer_tag1_id == gamer_tag.id) do
          connected_gamer_tag.gamer_tag1
        else
          connected_gamer_tag.gamer_tag2
        end
      end)
  end

  def get_connected_gamer_tag(gamer_tag, connected_tag) do
    from(
      ConnectedGamerTag, where: [gamer_tag1_id: ^gamer_tag.id, gamer_tag2_id: ^connected_tag.id],
                         or_where: [gamer_tag1_id: ^connected_tag.id, gamer_tag2_id: ^gamer_tag.id]
    ) |> Repo.one
  end

  def get_or_insert_connected_gamer_tag(gamer_tag, connected_tag) do
    {:ok, connected_tag} = case find_gamer_tag(connected_tag) do
      {:error, _} -> create_gamer_tag(connected_tag)
      res -> res
    end

    case get_connected_gamer_tag(gamer_tag, connected_tag) do
      nil ->
        {:ok, connected_tag} = ConnectedGamerTag.create_changeset(%{
          gamer_tag1_id: gamer_tag.id,
          gamer_tag2_id: connected_tag.id
        }) |> Repo.insert

        connected_tag

      tag_data -> connected_tag
    end
  end

  def get_all_gamer_tags_by_tag(tag) do
    from(gt in GamerTag, where: gt.tag == ^tag or gt.tag == ^slug_gamer_tag(tag))
      |> Repo.all
  end

  def get_all_gamer_tags_with_platform_region([head|tail]) when is_map(head) do
    Enum.reduce(tail, Ecto.Query.where(GamerTag, ^Map.to_list(head)), fn params, query ->
      query |> Ecto.Query.or_where(^Map.to_list(params))
    end) |> Ecto.Query.order_by(asc: :id) |> Repo.all
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

  defp slug_gamer_tag(gamer_tag), do: String.replace(~r/(.*)-(.*)/, gamer_tag, "\0#\1")
end
