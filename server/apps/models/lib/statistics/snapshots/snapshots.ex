defmodule Models.Statistics.Snapshots do
  alias Ecto.Multi
  alias Models.Model
  alias Models.{HeroesCache, Repo}
  alias Models.Statistics.Snapshots.{HeroStatistic, AllHeroesStatistic, SnapshotStatistic, LatestSnapshotStatistic}
  alias Models.Statistics.{CombatLifetime, CombatAverage, CombatBest, GameHistory, MatchAward, HeroSpecific}
  use Model

  Model.create_model_methods(SnapshotStatistic)
  Model.create_model_methods(HeroStatistic)

  def get_all_of_heroes_total_statistics_by_snapshot_ids(snapshot_ids, limit \\ nil, type \\ :competitive || :quickplay) do
    from(
      ahs in HeroStatistic,
      where: ahs.id in ^snapshot_ids,
      limit: ^limit
    )
      |> HeroStatistic.heroes_query(type)
      |> Repo.all
  end

  def get_all_hero_statistics_by_snapshot_ids(snapshot_ids, type \\ :competitive || :quickplay) do
    from(hs in HeroStatistic, where: hs.snapshot_statistic_id in ^snapshot_ids)
      |> HeroStatistic.heroes_total_query(type)
      |> Repo.all
  end

  def get_all_hero_statistics_by_id(hero_snapshot_ids, type \\ :competitive || :quickplay) do
    from(hs in HeroStatistic, where: hs.id in ^hero_snapshot_ids)
      |> HeroStatistic.heroes_total_query(type)
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
    get_all_hero_statistics(snapshot_statistic_id: snapshot_statistic_id,
                            staistic_type: :hero_total_quickplay)
  end

  def get_hero_statistics_for_snapshot(snapshot_statistic_id) do
    get_all_hero_statistics(snapshot_statistic_id: snapshot_statistic_id,
                            staistic_type: :hero_quickplay)
  end

  def create_all_hero_snapshots(hero_snapshots) do
    hero_snapshots = Enum.map(hero_snapshots, &(&1.changes))

    Multi.new()
      |> Multi.insert_all(:hero_snapshots, HeroStatistic, hero_snapshots)
      |> Repo.transaction
  end
end
