defmodule Scraper.ModelCreator.UserProfile do
  alias Models.Game

  @spec create_gamer_tag(Map) :: {:ok, Map} | {:error, String}
  def create_gamer_tag(user_profile) do
    case find_gamer_tag(user_profile) do
      {:error, "no tag found"} -> create_new_gamer_tag(user_profile)
      gamer_tag -> gamer_tag
    end
  end

  def find_gamer_tag(user_profile) do
    %{region: region, platform: platform, gamer_tag: tag} = user_profile
      |> Map.take([:gamer_tag, :region, :platform])

    Game.find_gamer_tag([region: region, platform: platform, tag: tag])
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

    Game.create_or_get_gamer_tag(params)
  end
end
