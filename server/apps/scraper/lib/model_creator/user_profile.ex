defmodule Scraper.ModelCreator.UserProfile do
  require Logger
  alias Models.Game

  def save_other_platforms(gamer_tag, %{other_platforms: other_platforms}) do
    Logger.info "Creating other_platforms for #{gamer_tag.tag} #{gamer_tag.platform} #{gamer_tag.region}: #{inspect other_platforms}"

    connected_tags = Enum.map(other_platforms, fn platform_tag_params ->
      {:ok, tag} = Game.find_or_create_gamer_tag(platform_tag_params)

      tag
    end)

    gamer_tag
      |> Models.Repo.preload(:connected_gamer_tags)
      |> Game.update_gamer_tag(%{connected_gamer_tags: connected_tags})
  end

  def update_or_create_gamer_tag(params) do
    params
      |> get_gamer_tag_params
      |> Game.update_or_create_gamer_tag([:tag, :region, :platform, :id])
  end

  defp get_gamer_tag_params(%{gamer_tag: tag} = params) do
    gamer_tag = %{
      tag: tag,
      overwatch_name: params.overwatch_name,
      portrait_url: params.portrait_url,
      total_games_won: params.total_games_won,
      competitive_level: params.competitive_level,
      competitive_rank_url: params.competitive_rank_url,
      level: params.level,
      level_url: params.level_url,
      rank_url: params.rank_url,
      platform: params.platform
    }

    if (Map.has_key?(params, :region)), do: Map.merge(gamer_tag, %{region: params.region}), else: gamer_tag
  end

  defp get_gamer_tag_params(params), do: params
end
