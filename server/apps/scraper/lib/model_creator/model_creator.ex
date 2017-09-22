defmodule Scraper.ModelCreator do
  require Logger

  alias Models.{Repo, Statistics.Snapshots}
  alias Models.Statistics.Snapshots.SnapshotStatistic
  alias Scraper.ModelCreator.{
    Heroes, UserProfile,
    HeroStats, ProfileStats,
    GamerTagSnapshotDiff
  }

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

      create_snapshot_if_diff(profile, gamer_tag, heroes)
    end
  end

  defp add_leaderboard_snapshot(profile) do
    with {:ok, leaderboard} <- Snapshots.create_or_get_leaderboard_snapshot() do
      Map.put(profile, :leaderboard_id, leaderboard.id)
    else
      _ -> profile
    end
  end

  defp add_averages_snapshot(profile) do
    with {:ok, snapshot_averages} <- Snapshots.create_or_get_average_snapshot() do
      Map.put(profile, :snapshot_averages_id, snapshot_averages.id)
    else
      _ -> profile
    end
  end

  defp create_snapshot_if_diff(profile, gamer_tag, heroes) do
    with :ok <- GamerTagSnapshotDiff.check_snapshots_different(gamer_tag, profile) do
      profile
        |> add_leaderboard_snapshot
        |> add_averages_snapshot
        |> create_snapshot(gamer_tag, heroes)
    else
      :error ->
        Logger.info "#{gamer_tag.tag} snapshot unchanged, not taking snapshot"

        %{
          snapshot_statistics: SnapshotStatistic.latest_stats_query(1) |> Repo.one,
          heroes: heroes,
          gamer_tag: gamer_tag,
          other_platforms: Map.get(profile, :other_platforms)
        }
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
