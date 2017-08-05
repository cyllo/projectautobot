defmodule Scraper.ModelCreator do
  require Logger

  alias Models.Repo
  alias Scraper.ModelCreator.{Heroes, UserProfile, HeroStats, ProfileStats}

  @spec save_profile(profile :: map) :: map
  @doc """
    Saves a profile from scraping
  """
  def save_profile(profile) do
    Logger.info "Storing #{profile.gamer_tag} into database"

    with heroes <- Heroes.create_from_stats(profile),
         {:ok, gamer_tag} <- UserProfile.update_or_create_gamer_tag(profile) do

      if profile |> Map.get(:other_platforms) |> Enum.any? do
        Task.start(fn -> UserProfile.save_other_platforms(gamer_tag, profile) end)
      end

      create_snapshot(profile, gamer_tag, heroes)
    end
  end

  defp create_snapshot(profile, gamer_tag, heroes) do
    query = HeroStats.create_snapshot_multi(profile, gamer_tag.id)
      |> ProfileStats.create_stats_multi(profile, gamer_tag)

    with {:ok, stats} <- Repo.transaction(query)  do
      %{
        snapshot_statistics: stats,
        heroes: heroes,
        gamer_tag: gamer_tag,
        other_platforms: Map.get(profile, :other_platforms)
      }
    end
  end
end
