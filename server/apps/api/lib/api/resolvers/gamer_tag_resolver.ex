defmodule Api.GamerTagResolver do
  import Api.Helpers, only: [preload_id_map: 2]

  alias Models.Game

  def all(params, _info) when params == %{}, do: {:ok, Game.get_all_gamer_tags()}
  def all(params, _info), do: {:ok, Game.get_all_gamer_tags(params)}
  def find(params, _info), do: Game.find_gamer_tag(params)

  def scrape(%{id: gamer_tag_id}, _info), do: Scraper.scrape_gamer_tag_by_id(gamer_tag_id)
  def scrape(%{region: _, platform: _, tag: _} = params, _info), do: scrape_by_tag_platform_region(params, [:platform, :tag, :region])
  def scrape(%{platform: _, tag: _} = params, _info), do: scrape_by_tag_platform_region(params, [:platform, :tag])
  def scrape(_, _info), do: {:error, "Must provide one of id, platform/region/tag or platform/tag if xbl/psn"}

  def get_chunked_gamer_tag_ids(%{statistics_max: statistics_max, statsitic_name: statistic_name, groups_of: groups_of}, _info) do
    Game.get_gamer_tags_in_statistic_chunks(statistic_name, groups_of: groups_of, statistics_max: statistics_max)
  end

  def get_chunked_gamer_tag_ids(%{groups_of: groups_of, statsitic_name: statistic_name}, _info) do
    Game.get_gamer_tags_in_statistic_chunks(statistic_name, groups_of: groups_of)
  end

  def start_watch(%{id: gamer_tag_id}, _info) do
    with {:ok, gamer_tag} <- Game.get_gamer_tag(gamer_tag_id),
         {:ok, gamer_tag} <- ProfileWatch.start_watch(gamer_tag) do
      {:ok, %{gamer_tag: gamer_tag, is_watched: true}}
    end
  end

  def end_watch(%{id: gamer_tag_id}, _info) do
    with {:ok, gamer_tag} <- Game.get_gamer_tag(gamer_tag_id),
         {:ok, gamer_tag} <- ProfileWatch.end_watch(gamer_tag) do
      {:ok, %{gamer_tag: gamer_tag, is_watched: false}}
    end
  end

  def search(%{tag: tag}, _info), do: Scraper.search_tag(tag)

  def get_gamer_tags_user(_, gamer_tags), do: preload_id_map(gamer_tags, :user)
  def get_gamer_tag_following_users(_, gamer_tag_ids), do: Game.get_following_users_by_gamer_tag_ids(gamer_tag_ids)

  def get_gamer_tag_connected_gamer_tags(_, gamer_tags) do
    gamer_tags
      |> Enum.map(&{&1, Game.get_connected_gamer_tags(&1)})
      |> Enum.reduce(%{}, fn {gamer_tag, connected_tags}, acc ->
        Map.put(acc, gamer_tag.id, connected_tags)
      end)
  end

  defp scrape_by_tag_platform_region(params, param_fields) do
    params
      |> Map.take(param_fields)
      |> Scraper.scrape_gamer_tag
  end
end
