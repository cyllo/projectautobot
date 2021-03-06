defmodule Scraper.ModelCreator.HeroSnapshot do
  alias Models.Statistics.Snapshots.HeroSnapshotStatistic

  def create_heroes_hero_snapshots(snapshot_id, %{competitive: competitive_stats, quickplay: quickplay_stats}) do
    Enum.concat([
      create_heroes_stats(snapshot_id, competitive_stats, :competitive),
      create_heroes_stats(snapshot_id, quickplay_stats, :quickplay)
    ])
  end

  def create_total_hero_snapshots(snapshot_id, %{competitive: competitive_stats, quickplay: quickplay_stats}) do
    [
      create_total_stats(snapshot_id, competitive_stats, :competitive),
      create_total_stats(snapshot_id, quickplay_stats, :quickplay)
    ]
  end

  defp create_total_stats(snapshot_id, statistics, type) do
    statistics
      |> create_statistics_params(snapshot_id, :total, type)
      |> HeroSnapshotStatistic.create_changeset
  end

  defp create_heroes_stats(snapshot_id, statistics, type) do
    statistics
      |> create_hero_statistics_params(snapshot_id, :heroes, type)
      |> Enum.map(&HeroSnapshotStatistic.create_changeset/1)
  end

  defp create_hero_statistics_params(statistics, snapshot_id, stats_type, play_type) do
    statistic_types = statistics
      |> Enum.group_by(fn {stat_name, _} ->
        Regex.run(~r/(.+)_#{play_type}_heroes_.+/, stat_name)
          |> List.last
      end)

    Enum.map(statistic_types, fn {hero_name, stats} ->
      create_statistics_params(stats, snapshot_id, stats_type, play_type)
        |> Map.put(:hero_id, Models.HeroesCache.get_hero_id_by_name(hero_name))
    end)
  end

  defp create_statistics_params(statistics, snapshot_id, stats_type, play_type) do
    params = %{
      snapshot_statistic_id: snapshot_id,
      statistic_type: get_statistic_type(stats_type, play_type)
    }

    for {key, stat} <- statistics, into: params do
      statistic_id_type({get_stats_key_type(key), stat})
    end
  end

  defp get_statistic_type(:total, :quickplay), do: :hero_total_quickplay
  defp get_statistic_type(:total, :competitive), do: :hero_total_competitive
  defp get_statistic_type(:heroes, :quickplay), do: :hero_quickplay
  defp get_statistic_type(:heroes, :competitive), do: :hero_competitive

  defp get_stats_key_type(key), do: Regex.run(~r/[^_]+$/, key) |> List.first |> Utility.safe_atom

  defp statistic_id_type({:average, %{id: id}}), do: {:game_average_statistic_id, id}
  defp statistic_id_type({:best, %{id: id}}), do: {:combat_best_statistic_id, id}
  defp statistic_id_type({:lifetime, %{id: id}}), do: {:combat_lifetime_statistic_id, id}
  defp statistic_id_type({:game, %{id: id}}), do: {:game_history_statistic_id, id}
  defp statistic_id_type({:awards, %{id: id}}), do: {:match_awards_statistic_id, id}
  defp statistic_id_type({:specific, %{id: id}}), do: {:hero_specific_statistic_id, id}
end
