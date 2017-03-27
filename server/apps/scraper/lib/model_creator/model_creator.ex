defmodule Scraper.ModelCreator do
  alias Scraper.ModelCreator.Heroes

  def save_profile(profile) do
    # %GamerTag{
    #   tag: profile.gamertag,
    #   level: profile.level,
    #   level_url: profile.level_url,
    #   total_games_won: profile.total_games_won,
    #   overwatch_name: profile.overwatch_name,
    #   portrait_url: profile.portrait_url,
    #   competitive_level: profile.competitive_level,
    #   competitive_rank_url: profile.competitive_rank_url
    # }
  end

  def create_models_from_stats(%{competitive: competitive, quickplay: quickplay}) do
    %{heroes_stats: competitive_heroes_stats, general_stats: competitive_general_stats} = competitive
    %{heroes_stats: quickplay_heroes_stats, general_stats: quickplay_general_stats} = quickplay

    Heroes.get_new_heroes_from_stats(competitive_heroes_stats, quickplay_heroes_stats)
  end
end
