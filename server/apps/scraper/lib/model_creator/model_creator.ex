defmodule Scraper.ModelCreator do
  require Logger

  alias Scraper.ModelCreator.{Heroes, UserProfile, Stats}

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

      quickplay_snapshot = profile
        |> Map.get(:quickplay)
        |> Stats.create_snapshot(gamer_tag, competitive?: false)

      competitive_snapshot = profile
        |> Map.get(:competitive)
        |> Stats.create_snapshot(gamer_tag, competitive?: true)

      %{
        quickplay_snapshot: quickplay_snapshot,
        competitive_snapshot: competitive_snapshot,
        heroes: heroes,
        gamer_tag: gamer_tag,
        other_platforms: Map.get(profile, :other_platforms)
      }
    end
  end
end
