defmodule Scraper.ModelCreator do
  require IEx
  require Logger
  alias Scraper.ModelCreator.{Heroes, UserProfile, Stats}

  def save_profile(profile) do
    Logger.debug "Storing #{Map.get(profile, :gamer_tag)} into database"

    with heroes <- Heroes.create_from_stats(profile),
         {:ok, gamer_tag} <- UserProfile.create_gamer_tag(profile) do

      quickplay_snapshot = Map.get(profile, :quickplay) |> Stats.create_snapshot(gamer_tag, competitive?: false)
      competitive_snapshot = Map.get(profile, :competitive) |> Stats.create_snapshot(gamer_tag, competitive?: true)

      %{
        quickplay_snapshot: quickplay_snapshot,
        competitive_snapshot: competitive_snapshot,
        heroes: heroes,
        gamer_tag: gamer_tag
      }
    end
  end
end
