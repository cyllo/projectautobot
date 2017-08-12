defmodule Models.Statistics.Snapshots do
  use Models.Model

  alias Ecto.Multi
  alias Models.Model
  alias Models.{Enums, Repo}
  alias Models.Statistics.Snapshots.{
    HeroSnapshotStatistic, SnapshotStatistic,
    LeaderboardSnapshotStatistic, StatisticsAveragesSnapshot
  }

  Model.create_model_methods(SnapshotStatistic)
  Model.create_model_methods(HeroSnapshotStatistic)
  Model.create_model_methods(LeaderboardSnapshotStatistic)
  Model.create_model_methods(StatisticsAveragesSnapshot)

  def get_first_snapshot_statistic(prop \\ :inserted_at), do: Ecto.Query.last(SnapshotStatistic, prop) |> Repo.one

  def get_all_of_heroes_total_statistics_by_snapshot_ids(snapshot_ids, limit \\ nil, type \\ :competitive || :quickplay) do
    from(
      ahs in HeroSnapshotStatistic,
      where: ahs.id in ^snapshot_ids,
      limit: ^limit
    )
      |> HeroSnapshotStatistic.heroes_query(type)
      |> Repo.all
  end

  def get_all_hero_statistics_by_snapshot_ids(snapshot_ids, type \\ :competitive || :quickplay) do
    from(hs in HeroSnapshotStatistic, where: hs.snapshot_statistic_id in ^snapshot_ids)
      |> HeroSnapshotStatistic.heroes_query(type)
      |> Repo.all
  end

  def get_all_hero_statistics_by_id(hero_snapshot_ids, type) do
    from(hs in HeroSnapshotStatistic, where: hs.id in ^hero_snapshot_ids)
      |> HeroSnapshotStatistic.heroes_query(type)
      |> Repo.all
  end

  def get_all_hero_total_statistics_by_snapshot_ids(snapshot_ids, type) do
    from(hs in HeroSnapshotStatistic, where: hs.snapshot_statistic_id in ^snapshot_ids)
      |> HeroSnapshotStatistic.heroes_total_query(type)
      |> Repo.all
  end

  def get_latest_snapshots_for_gamer_tag(gamer_tag_id) do
    from(lss in SnapshotStatistic, where: lss.gamer_tag_id == ^gamer_tag_id)
      |> Repo.all
  end

  def get_snapshot_statistics_by_gamer_tag_ids(gamer_tag_ids, opts \\ [])
  def get_snapshot_statistics_by_gamer_tag_ids(gamer_tag_ids, opts) when is_map(opts) do
    get_snapshot_statistics_by_gamer_tag_ids(gamer_tag_ids, Map.to_list(opts))
  end

  def get_snapshot_statistics_by_gamer_tag_ids(gamer_tag_ids, opts) do
    from(ss in SnapshotStatistic, where: ss.gamer_tag_id in ^gamer_tag_ids)
      |> Model.create_model_filters(opts)
      |> Repo.all
  end

  def get_gamer_tag_snapshot_statistics(gamer_tag_id) do
    get_all_snapshot_statistics(gamer_tag_id: gamer_tag_id)
  end

  def get_heroes_total_statistic_for_snapshot(snapshot_statistic_id) do
    get_all_hero_snapshot_statistics(snapshot_statistic_id: snapshot_statistic_id,
                            staistic_type: :hero_total_quickplay)
  end

  def get_hero_statistics_for_snapshot(snapshot_statistic_id) do
    get_all_hero_snapshot_statistics(snapshot_statistic_id: snapshot_statistic_id,
                            staistic_type: :hero_quickplay)
  end

  def average(type) do
    %{hero_snapshot_statistics: [hero_stats_average]} = HeroSnapshotStatistic.average_stats_query
      |> HeroSnapshotStatistic.stats_type_query(Enums.create_stats_type(:hero, type))
      |> Repo.one

    %{hero_snapshot_statistics: [hero_total_stats_average]} = HeroSnapshotStatistic.average_stats_query
      |> HeroSnapshotStatistic.stats_type_query(Enums.create_stats_type(:hero_total, type))
      |> Repo.one

    %{
      heroes_total_snapshot_statistic: hero_total_stats_average,
      hero_snapshot_statistics: hero_stats_average
    }
  end

  def hero_average(hero_id, type) do
    %{hero_snapshot_statistics: [hero_snapshot_statistic]} = Enums.create_stats_type(:hero, type)
      |> HeroSnapshotStatistic.average_stats_by_stats_type_query
      |> HeroSnapshotStatistic.where_hero_query(hero_id)
      |> Repo.one

    hero_snapshot_statistic
  end

  def create_all_hero_snapshots(hero_snapshots) do
    hero_snapshots = Enum.map(hero_snapshots, &(&1.changes))

    Multi.new()
      |> Multi.insert_all(:hero_snapshots, HeroSnapshotStatistic, hero_snapshots)
      |> Repo.transaction
  end

  def create_leaderboard(leaderboard) do
    leaderboard
      |> LeaderboardSnapshotStatistic.create_changeset
      |> Repo.insert
  end

  def find_one_leaderboard_snapshot(params) do
    leaderboard = Ecto.Query.from(LeaderboardSnapshotStatistic)
      |> Model.create_model_filters(params)
      |> Ecto.Query.first
      |> Repo.one

    case leaderboard do
      nil -> {:error, "No leaderboard found #{inspect params}"}
      leaderboard -> {:ok, leaderboard}
    end
  end

  def create_or_get_leaderboard_snapshot do
    with {:ok, leaderboard_snapshot} <- StatsLeaderboard.snapshot_leaderboard_rankings do
      {:ok, leaderboard_snapshot}
    else
      e ->
        case Repo.one(LeaderboardSnapshotStatistic.latest_snapshot_query) do
          nil -> {:error, "No Leaderboard Snapshot found"}
          leaderboard_snapshot -> {:ok, leaderboard_snapshot}
        end
    end
  end

  def get_latest_averages_snapshot do
    case Repo.one(StatisticsAveragesSnapshot.latest_snapshot_query()) do
      nil -> {:error, "No snapshot averages found"}
      averages_snapshot -> averages_snapshot
    end
  end

  def create_averages(averages) do
    StatisticsAveragesSnapshot.create_changeset(averages)
      |> Repo.insert
  end

  def create_or_get_average_snapshot do
    with {:ok, average_snapshot} <- StatsAverages.snapshot_averages() do
      {:ok, average_snapshot}
    else
      e ->
        case Repo.one(StatisticsAveragesSnapshot.latest_snapshot_query) do
          nil -> {:error, "No Leaderboard Snapshot found"}
          average_snapshot -> {:ok, average_snapshot}
        end
    end
  end

  def find_one_average_snapshot(params) do
    statistics_averages_snapshot = Ecto.Query.from(StatisticsAveragesSnapshot)
      |> Model.create_model_filters(params)
      |> Ecto.Query.first
      |> Repo.one

    case statistics_averages_snapshot do
      nil -> {:error, "No statistics averages snapshot found #{inspect params}"}
      statistics_averages_snapshot -> {:ok, statistics_averages_snapshot}
    end
  end
end
