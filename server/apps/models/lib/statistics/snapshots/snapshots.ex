defmodule Models.Statistics.Snapshots do
  use Models.Model
  require IEx
  alias Models.{HeroesCache, Repo}
  alias Models.Statistics.Snapshots.Hero, as: HeroSnapshot
  alias Models.Statistics.Snapshots.{AllHeroes, Snapshot}
  alias Models.Statistics.{CombatLifetime, CombatAverage, CombatBest, GameHistory, MatchAward, HeroSpecific}

  def create_snapshot(gamer_tag_id, heroes_stats, general_stats, is_competitive \\ false) do
    Ecto.Multi.new()
      |> Ecto.Multi.insert(:snapshot_statistic, create_snapshot_for_gamer_tag(gamer_tag_id, is_competitive))
      |> Ecto.Multi.run(:heroes_snapshot_statistic, &(create_heroes_stats(&1, heroes_stats)))
      |> Ecto.Multi.run(:general_snapshot_statistic, &(create_general_stats(&1, general_stats)))
      |> Repo.transaction
  end


  def create_snapshot_for_gamer_tag(gamer_tag_id, is_competitive), do: Snapshot.create_changeset(%{gamer_tag_id: gamer_tag_id, is_competitive: is_competitive})

  def create_general_stats(%{snapshot_statistic: snapshot_statistic}, general_stats), do: create_general_stats(snapshot_statistic, general_stats)
  def create_general_stats(snapshot_statistic, general_stats) do
    with {:ok, stats} <- general_stats |> create_stats_multi |> Repo.transaction do
      general_statistics = %{snapshot_statistic_id: Map.get(snapshot_statistic, :id)}
      all_heroes_snapshot = for stat <- stats, into: general_statistics, do: create_stats_id_type(stat)

      all_heroes_snapshot
        |> AllHeroes.create_changeset
        |> Repo.insert
    end
  end

  def create_hero_snapshot(stats, snapshot_statistic, hero_name) do
    snapshot_statistic_id = Map.get(snapshot_statistic, :id)

    hero_snapshot = %{
      hero_id: HeroesCache.get_hero_id_by_name(hero_name),
      snapshot_statistic_id: snapshot_statistic_id
    }

    hero_snapshot = for stat <- stats, into: hero_snapshot, do: create_stats_id_type(stat)

    hero_snapshot
      |> HeroSnapshot.create_changeset
      |> Repo.insert
  end


  def create_heroes_stats(%{snapshot_statistic: snapshot_statistic}, heroes_stats), do: create_heroes_stats(snapshot_statistic, heroes_stats)
  def create_heroes_stats(snapshot_statistic, heroes_stats) do
    heroes_stats
      |> Enum.reduce(Ecto.Multi.new(), fn(%{name: hero_name, stats: hero_stats}, multi_acc) ->
          lower_name = String.downcase(hero_name)
          snapshot_name = String.to_atom(lower_name <> "_snapshot")
          stats_name = String.to_atom(lower_name <> "_stats")

          multi_acc
            |> Ecto.Multi.run(stats_name, fn(_) ->
              hero_name |> create_stats_multi(hero_stats) |> Repo.transaction
            end)
            |> Ecto.Multi.run(snapshot_name, fn(stats) ->
              stats
                |> Map.get(stats_name)
                |> create_hero_snapshot(snapshot_statistic, hero_name)
            end)
        end)
      |> Repo.transaction
  end

  defp create_stats_multi(hero_name \\ nil, stats) do
    Enum.reduce stats, Ecto.Multi.new(), fn({stat_type, stat}, multi_acc) ->
      stat = if stat_type === :hero_specific, do: process_stats({stat_type, hero_name, stat}), else: process_stats({stat_type, stat})

      Ecto.Multi.insert(multi_acc, stat_type, stat)
    end
  end

  defp create_stats_id_type({:average, %{id: id}}), do: {:combat_average_statistic_id, id}
  defp create_stats_id_type({:best, %{id: id}}), do: {:combat_best_statistic_id, id}
  defp create_stats_id_type({:lifetime, %{id: id}}), do: {:combat_lifetime_statistic_id, id}
  defp create_stats_id_type({:game, %{id: id}}), do: {:game_history_statistic_id, id}
  defp create_stats_id_type({:match_awards, %{id: id}}), do: {:match_awards_statistic_id, id}
  defp create_stats_id_type({:hero_specific, %{id: id}}), do: {:hero_specific_statistic_id, id}

  defp process_stats({:average, stats}), do: CombatAverage.create_changeset(stats)
  defp process_stats({:best, stats}), do: CombatBest.create_changeset(stats)
  defp process_stats({:game, stats}), do: GameHistory.create_changeset(stats)
  defp process_stats({:lifetime, stats}), do: CombatLifetime.create_changeset(stats)
  defp process_stats({:match_awards, stats}), do: MatchAward.create_changeset(stats)
  defp process_stats({:hero_specific, hero_name, stats}) do
    IO.puts "HERO_CACHE: #{hero_name} #{HeroesCache.get_hero_id_by_name(hero_name)}"
    HeroSpecific.create_changeset(%{hero_id: HeroesCache.get_hero_id_by_name(hero_name), stats: stats})
  end
end