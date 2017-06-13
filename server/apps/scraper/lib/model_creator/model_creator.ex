defmodule Scraper.ModelCreator do
  require Logger

  alias Scraper.ModelCreator.{Heroes, UserProfile, Stats}

  def save_profile(profile) do
    Logger.debug "Storing #{Map.get(profile, :gamer_tag)} into database"

    with heroes <- Heroes.create_from_stats(profile),
         {:ok, gamer_tag} <- UserProfile.create_gamer_tag(profile) do

      if Enum.any? Map.get(profile, :other_platforms) do
        UserProfile.save_other_platforms(gamer_tag, profile)
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
