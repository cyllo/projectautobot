defmodule Scraper.ModelCreator.UserProfile do
  require Logger
  alias Models.Game

  @spec create_gamer_tag(Map) :: {:ok, Map} | {:error, String}
  def create_gamer_tag(user_profile) do
    case find_gamer_tag(user_profile) do
      {:error, _} -> create_new_gamer_tag(user_profile)
      gamer_tag -> gamer_tag
    end
  end

  def find_gamer_tag(%{platform: platform, region: region, gamer_tag: tag}) do
    Game.find_gamer_tag(region: region, platform: platform, tag: Utility.normalize_gamer_tag(tag))
  end

  def find_gamer_tag(%{platform: platform, gamer_tag: tag}) do
    Game.find_gamer_tag(platform: platform, tag: Utility.normalize_gamer_tag(tag))
  end

  def create_new_gamer_tag(%{
    gamer_tag: tag,
    overwatch_name: overwatch_name,
    portrait_url: portrait_url,
    total_games_won: total_games_won,
    competitive_level: competitive_level,
    competitive_rank_url: competitive_rank_url,
    level: level,
    level_url: level_url,
    region: region,
    platform: platform
  }) do
    params = %{
      tag: tag,
      overwatch_name: overwatch_name,
      portrait_url: portrait_url,
      total_games_won: total_games_won,
      competitive_level: competitive_level,
      competitive_rank_url: competitive_rank_url,
      level: level,
      level_url: level_url
    }

    params = if (platform) do
      Map.merge(params, %{region: region, platform: platform})
    else
      Map.put(params, :platform, platform)
    end

    Game.create_gamer_tag(params)
  end

  def create_new_gamer_tag(params), do: Game.create_gamer_tag(params)

  def save_other_platforms(gamer_tag, %{other_platforms: other_platforms}) do
    Logger.debug "Creating other_platforms for #{gamer_tag.tag}: #{inspect other_platforms}"

    connected_tags = Enum.map(other_platforms, fn platform_tag_params ->
      {:ok, tag} = Game.find_gamer_tag(platform_tag_params)

      tag
    end)

    gamer_tag
      |> Models.Repo.preload(:connected_gamer_tags)
      |> Game.update_gamer_tag(%{connected_gamer_tags: connected_tags})
  end
end
