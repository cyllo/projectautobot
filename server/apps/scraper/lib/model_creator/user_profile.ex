defmodule Scraper.ModelCreator.UserProfile do
  require Logger
  require IEx
  alias Models.Game

  @spec create_gamer_tag(Map) :: {:ok, Map} | {:error, String}
  def create_gamer_tag(user_profile) do
    case find_gamer_tag(user_profile) do
      {:error, _} -> create_new_gamer_tag(user_profile)
      gamer_tag -> gamer_tag
    end
  end

  def find_gamer_tag(%{platform: platform, region: region, gamer_tag: tag}) do
    Game.find_gamer_tag(region: region, platform: platform, tag: tag)
  end

  def find_gamer_tag(%{platform: platform, gamer_tag: tag}) do
    Game.find_gamer_tag(platform: platform, tag: tag)
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

    other_platforms
      |> Enum.map(&create_new_gamer_tag/1)
  end
end
