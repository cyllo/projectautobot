defmodule Scraper.ModelCreator.Stats do
  alias Ecto.Multi
  alias Models.Repo
  alias Scraper.ModelCreator.HeroSnapshot
  alias Models.Statistics.Snapshots.HeroStatistic, as: HeroStatisticSnapshot
  alias Models.Statistics.{
    Snapshots.SnapshotStatistic,
    Snapshots, CombatLifetime, CombatAverage,
    CombatBest, GameHistory, MatchAward, HeroSpecific
  }


# %{heroes_stats: heroes_stats, total_stats: total_stats}
  def create_snapshot(%{quickplay: quickplay, competitive: competitive}, gamer_tag_id) do
    Multi.new()
      |> Multi.insert(:snapshot_statistic, create_gamer_tag_snapshot(gamer_tag_id))
      |> create_statistics_multi(quickplay, competitive)
      |> Repo.transaction
  end

  defp create_gamer_tag_snapshot(gamer_tag_id), do: SnapshotStatistic.create_changeset(%{gamer_tag_id: gamer_tag_id})

  defp create_statistics_multi(multi, quickplay, competitive) do
    multi
      |> create_stat_type_multi("quickplay", quickplay)
      |> create_stat_type_multi("competitive", competitive)
      |> Multi.run(:hero_snapshot_statistics, &create_hero_snapshot_stats(&1))
  end

  defp create_hero_snapshot_stats(%{snapshot_statistic: %{id: snapshot_id}} = data) do
    {competitive_data, quickplay_data} = data
      |> Map.delete(:snapshot_statistic)
      |> Map.to_list
      |> Enum.split_with(fn {key, _} -> String.contains?(key, "competitive") end)

    {competitive_total_stats, competitive_heroes_stats} = split_total_stat_type(competitive_data)
    {quickplay_total_stats, quickplay_heroes_stats} = split_total_stat_type(quickplay_data)

    total_stats = HeroSnapshot.create_total_hero_snapshots(snapshot_id, %{
      competitive: competitive_total_stats,
      quickplay: quickplay_total_stats
    })

    heroes_stats = HeroSnapshot.create_heroes_hero_snapshots(snapshot_id, %{
      competitive: competitive_heroes_stats,
      quickplay: quickplay_heroes_stats
    })

    Snapshots.create_all_hero_snapshots(total_stats ++ heroes_stats)
  end

  defp split_total_stat_type(stats) do
    Enum.split_with(stats, fn {key, _} -> String.contains?(key, "total") end)
  end

  defp create_stat_type_multi(multi, play_type, %{heroes_stats: heroes_stats, total_stats: total_stats}) do
    multi = heroes_stats
      |> Enum.reduce(multi, &create_hero_stat_multi(&2, play_type <> "_heroes", &1))

    total_stats
      |> Map.to_list
      |> Enum.reduce(multi, &create_stat_multi(&2, play_type <> "_total", &1))
  end

  defp create_hero_stat_multi(multi, play_type, stats) when is_list(stats) do
    Enum.map(stats, &create_hero_stat_multi(multi, play_type, &1))
  end

  defp create_hero_stat_multi(multi, play_type, %{name: hero_name, stats: stats}) do
    stats
      |> Map.to_list
      |> Enum.reduce(multi, &create_hero_stat_multi(&2, hero_name, play_type, &1))
  end

  defp create_hero_stat_multi(multi, hero_name, name, {:hero_specific, stat}) do
    insert_stat(multi, join_keys([hero_name, name]), :hero_specific, create_stat({:hero_specific, hero_name, stat}))
  end

  defp create_hero_stat_multi(multi, hero_name, name, {type, stat}) do
    insert_stat(multi, join_keys([hero_name, name]), type, create_stat({type, stat}))
  end

  defp join_keys(list), do: Enum.join(list, "_")

  defp create_stat_multi(multi, play_type, {type, stat}), do: insert_stat(multi, play_type, type, create_stat({type, stat}))

  defp insert_stat(multi, play_type, type, stats), do: Multi.insert(multi, play_type <> "_" <> Atom.to_string(type), stats)

  defp create_stat({:average, stats}), do: CombatAverage.create_changeset(stats)
  defp create_stat({:best, stats}), do: CombatBest.create_changeset(stats)
  defp create_stat({:game, stats}), do: GameHistory.create_changeset(stats)
  defp create_stat({:lifetime, stats}), do: CombatLifetime.create_changeset(stats)
  defp create_stat({:match_awards, stats}), do: MatchAward.create_changeset(stats)
  defp create_stat({:hero_specific, hero_name, stats}) do
    case Models.HeroesCache.get_hero_id_by_name(hero_name) do
      nil -> throw {:error, "#{hero_name} not found in cache #{inspect stats}"}
      hero_id -> HeroSpecific.create_changeset(%{hero_id: hero_id, stats: stats})
    end
  end
end
