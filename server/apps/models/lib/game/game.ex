defmodule Models.Game do
  use Models.Model

  alias Models.Game.{Hero, HeroRole, GamerTag, ConnectedGamerTag, GamerTagUserFollower}
  alias Models.Statistics.Snapshots.SnapshotStatistic
  alias Models.{Repo, Model}

  @statistic_relations [
    :game_average_statistic, :game_history_statistic,
    :combat_best_statistic, :combat_lifetime_statistic,
    :match_awards_statistic
  ]

  @hero_snapshot_relations [:hero, :hero_specific_statistic] ++ @statistic_relations

  def find_gamer_tag(%{tag: tag, platform: platform, region: region}) do
    find_gamer_tag(tag: Utility.normalize_gamer_tag(tag), platform: platform, region: region)
  end

  def find_gamer_tag(%{tag: tag}) do
    find_gamer_tag(tag: Utility.normalize_gamer_tag(tag))
  end

  @spec find_or_create_gamer_tag(Map) :: {:ok, Map} | {:error, String}
  def find_or_create_gamer_tag(user_profile) do
    case find_gamer_tag(user_profile) do
      {:error, _} -> create_gamer_tag(user_profile)
      gamer_tag -> gamer_tag
    end
  end

  def get_connected_gamer_tag(gamer_tag, connected_tag) do
    from(
      ConnectedGamerTag, where: [gamer_tag1_id: ^gamer_tag.id, gamer_tag2_id: ^connected_tag.id],
                         or_where: [gamer_tag1_id: ^connected_tag.id, gamer_tag2_id: ^gamer_tag.id]
    ) |> Repo.one
  end

  def get_full_heroes do
    Repo.all(from(Hero, preload: [:skills, :role]))
  end

  Model.create_model_methods(Hero)
  Model.create_model_methods(HeroRole)
  Model.create_model_methods(GamerTag)
  Model.create_model_methods(ConnectedGamerTag)

  def search_gamer_tag(tag) do
    GamerTag.search_tag_query(tag)
      |> Repo.all
  end

  def preload_latest_snapshots(gamer_tag, limit \\ 1) do
    Repo.preload(gamer_tag, snapshot_statistics: SnapshotStatistic.latest_stats_query(limit))
      |> Map.update!(:snapshot_statistics, &Enum.take(&1, -2))
  end

  def get_following_users_by_gamer_tag_ids(gamer_tag_ids) do
    from(gtuf in GamerTagUserFollower, where: gtuf.gamer_tag_id in ^gamer_tag_ids,
                                       preload: :user)
    |> Repo.all
    |> group_by_gamer_tag_id
  end

  defp group_by_gamer_tag_id(gamer_tag_user_followers) do
    Enum.reduce(gamer_tag_user_followers, %{}, fn follower, accum ->
      if Map.has_key?(accum, follower.gamer_tag_id) and !(follower.user in accum[follower.gamer_tag_id]) do
        accum[follower.gamer_tag_id] ++ [follower.user]
      else
        Map.put(accum, follower.gamer_tag_id, [follower.user])
      end
    end)
  end

  def get_connected_gamer_tags(gamer_tag) do
    from(cgt in ConnectedGamerTag, preload: [:gamer_tag2, :gamer_tag1],
                                       where: cgt.gamer_tag1_id == ^gamer_tag.id or
                                              cgt.gamer_tag2_id == ^gamer_tag.id)

      |> Repo.all
      |> Enum.map(fn connected_gamer_tag ->
        if (connected_gamer_tag.gamer_tag1_id === gamer_tag.id) do
          connected_gamer_tag.gamer_tag2
        else
          connected_gamer_tag.gamer_tag1
        end
      end)
  end

  def create_gamer_tag_follower(user, gamer_tag_id) do
    with {:ok, gamer_tag} <- get_gamer_tag(gamer_tag_id),
         {:ok, _} <- create_gamer_tag_user_follower(gamer_tag.id, user.id) do
      {:ok, %{user: user, gamer_tag: gamer_tag}}
    end
  end

  def remove_gamer_tag_follower(user, gamer_tag_id) do
    with {:ok, gamer_tag} <- get_gamer_tag(gamer_tag_id) do
      with {:ok, gamer_tag_user_follower} <- get_gamer_tag_user_follower(gamer_tag_id, user.id),
           {1, _} <- Ecto.Query.where(GamerTagUserFollower, [gamer_tag_id: ^gamer_tag_id, user_id: ^user.id]) |> Repo.delete_all do
        {:ok, gamer_tag_user_follower}
      else
        {0, _} -> {:error, "#{user.display_name} isn't following #{gamer_tag.tag}"}
        e -> e
      end
    end
  end

  def get_gamer_tag_user_follower(gamer_tag_id, user_id) do
    res = from(GamerTagUserFollower, preload: [:gamer_tag, :user],
                                     where: [gamer_tag_id: ^gamer_tag_id, user_id: ^user_id]) |> Repo.one
    case res do
      nil -> {:error, "User #{user_id} isn't following gamer tag #{gamer_tag_id}"}
      res -> {:ok, res}
    end
  end

  defp create_gamer_tag_user_follower(gamer_tag_id, user_id) do
    GamerTagUserFollower.create_changeset(%{gamer_tag_id: gamer_tag_id, user_id: user_id})
      |> Repo.insert
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

      _ -> connected_tag
    end
  end

  def get_all_gamer_tags_by_tag(tag) do
    from(gt in GamerTag, where: gt.tag == ^tag or gt.tag == ^slug_gamer_tag(tag))
      |> Repo.all
  end

  def get_all_gamer_tags_with_platform_region([head|tail]) when is_map(head) do
    Enum.reduce(tail, Ecto.Query.where(GamerTag, ^platform_region_to_list(head)), fn params, query ->
      query |> Ecto.Query.or_where(^platform_region_to_list(params))
    end) |> Ecto.Query.order_by(asc: :id) |> Repo.all
  end

  defp platform_region_to_list(%{platform: platform, region: region}), do: [platform: platform, region: region]

  def get_all_gamer_tags_by_ids(ids) do
    from(gt in GamerTag, where: gt.id in ^ids)
      |> Repo.all
  end

  def get_gamer_tag_with_snapshots(id) do
    get_gamer_tag(id, snapshot_statistics: [
      hero_snapshot_statistics: @hero_snapshot_relations
    ])
  end

  # opts groups_of/statistics_max
  def get_gamer_tags_in_statistic_chunks(stats_path, opts) do
    items = get_snapshot_statisitc_path(stats_path)
    max = Keyword.get_lazy(opts, :statistics_max, fn -> get_statistics_max(items) end)
    groups_of = Keyword.get_lazy(opts, :groups_of, fn -> raise "Must provide groups of" end)

    Enum.reduce(items, create_groups_table(max, groups_of), fn {stats, %{gamer_tag_id: gamer_tag_id}}, acc ->
      group = (div(stats, groups_of) + 1) * groups_of

      Map.update!(acc, group, &[gamer_tag_id | &1])
    end)
  end

  defp create_groups_table(max, groups) do
    Enum.reduce(0..div(max, groups), %{}, fn i, acc ->
      Map.put(acc, (i + 1) * groups, [])
    end)
  end

  defp get_snapshot_statisitc_path([snapshot_type, stats_type, stat_name] = stats_path) do
    preload_params = Keyword.new([{Utility.safe_atom(snapshot_type), Utility.safe_atom(stats_type)}])

    SnapshotStatistic.latest_stats_query
      |> Ecto.Query.preload(^preload_params)
      |> Repo.all
      |> Enum.map(fn item ->
        {Utility.get_in_schema_struct(item, Enum.map(stats_path, &Utility.safe_atom/1), 0), item}
      end)
  end

  defp get_statistics_max(items) do
    Enum.max_by(items, &elem(&1, 0))
      |> elem(0)
  end

  def create_hero(name, code) do
    Hero.create_changeset(%{name: name, code: code})
      |> Repo.insert
  end

  def create_heroes(heroes) do
    try do
      roles = Enum.uniq_by(heroes, &get_in(&1, [:role, :name]))
        |> Enum.map(&Map.get(&1, :role))
        |> Enum.filter(&not(is_nil(&1)))

      {_, %{heroes_and_relations: heroes}} = Hero.create_heroes_query(heroes, roles)
        |> Repo.transaction

      {:ok, heroes}
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

  defp slug_gamer_tag(gamer_tag), do: String.replace(~r/(.*)-(.*)/, gamer_tag, "\0#\1")
end
