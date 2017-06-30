defmodule Scraper.ModelCreator.UserProfile do
  require Logger
  alias Models.Game

  def find_or_create_gamer_tag(%{
    gamer_tag: tag,
    overwatch_name: overwatch_name,
    portrait_url: portrait_url,
    total_games_won: total_games_won,
    competitive_level: competitive_level,
    competitive_rank_url: competitive_rank_url,
    level: level,
    level_url: level_url,
    rank_url: rank_url,
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
      level_url: level_url,
      rank_url: rank_url
    }

    params = if (platform) do
      Map.merge(params, %{region: region, platform: platform})
    else
      Map.put(params, :platform, platform)
    end

    Game.find_or_create_gamer_tag(params)
  end

  def find_or_create_gamer_tag(params), do: Game.find_or_create_gamer_tag(params)

  def save_other_platforms(gamer_tag, %{other_platforms: other_platforms}) do
    Logger.debug "Creating other_platforms for #{gamer_tag.tag}: #{inspect other_platforms}"

    connected_tags = Enum.map(other_platforms, fn platform_tag_params ->
      {:ok, tag} = find_or_create_gamer_tag(platform_tag_params)

      tag
    end)

    gamer_tag
      |> Models.Repo.preload(:connected_gamer_tags)
      |> Game.update_gamer_tag(%{connected_gamer_tags: connected_tags})
  end
end
