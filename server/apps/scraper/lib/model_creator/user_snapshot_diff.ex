defmodule Scraper.ModelCreator.GamerTagSnapshotDiff do
  import Ecto.Query, only: [join: 5, from: 2]

  alias Ecto.Query
  alias Models.Repo
  alias Models.Statistics.Snapshots.{HeroSnapshotStatistic, SnapshotStatistic}

  def check_snapshots_different(gamer_tag, profile) do
    latest_medals = latest_gamer_tag_medals(gamer_tag)
    last_hero_total_competitive = Keyword.get(latest_medals, :hero_total_competitive)
    last_hero_total_quickplay = Keyword.get(latest_medals, :hero_total_quickplay)
    current_hero_total_competitive = profile_total_medals(profile, :competitive)
    current_hero_total_quickplay = profile_total_medals(profile, :quickplay)

    snapshot_same? = last_hero_total_competitive === current_hero_total_competitive and
                     last_hero_total_quickplay === current_hero_total_quickplay

    if (snapshot_same?), do: :error, else: :ok
  end

  defp latest_gamer_tag_medals(gamer_tag) do
    gamer_tag.id
      |> SnapshotStatistic.latest_total_medals
      |> Repo.all
  end

  defp profile_total_medals(profile, statistic_type) do
    get_in(profile, [statistic_type, :total_stats, :match_awards, :total_medals])
  end
end
