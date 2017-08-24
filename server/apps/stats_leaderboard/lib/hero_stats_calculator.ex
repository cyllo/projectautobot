defmodule StatsLeaderboard.HeroStatsCalculator do
  alias StatsLeaderboard.RankingsCalculator

  @rankable_hero_snapshot_stats_keys [
    :combat_average_statistic,
    :combat_best_statistic, :combat_lifetime_statistic,
    :game_history_statistic, :hero_specific_statistic,
    :match_awards_statistic
  ]

  @hero_snapshot_metadata_keys [:statistic_type, :hero_id]
  @blacklist_keys [:__schema__, :__meta__, :id, :stats, :hero]

  def calculate(stats) do
    stats
      |> Enum.map(&take_hero_snapshot_stats/1)
      |> List.flatten
      |> Enum.group_by(&(&1.statistic_type), &Map.delete(&1, :statistic_type))
      |> Utility.map_values(&rank_by_hero_id/1)
      |> Utility.map_values(&remove_totals_subobject/1)
  end

  defp take_hero_snapshot_stats(%{hero_snapshot_statistics: hero_snapshots, gamer_tag_id: gamer_tag_id}) do
    Enum.map(hero_snapshots, fn hero_snapshot ->
      hero_snapshot
        |> Map.take(@rankable_hero_snapshot_stats_keys)
        |> reduce_values_to_map
        |> Map.merge(Map.take(hero_snapshot, @hero_snapshot_metadata_keys))
        |> Map.put(:gamer_tag_id, gamer_tag_id)
    end)
  end

  defp reduce_values_to_map(snapshot_stats) do
    snapshot_stats
      |> Map.values
      |> Utility.filter_not_nil
      |> Enum.reduce(%{}, fn item, acc ->
        new_stat = item |> Map.from_struct |> Map.drop(@blacklist_keys)

        stats =  Map.merge(acc, new_stat)

        case item do
          %{stats: hero_stats} -> Map.merge(stats, Utility.atomize_keys(hero_stats))
          _ -> stats
        end
      end)
  end

  defp rank_by_hero_id(hero_stats) do
    hero_stats
      |> group_by_hero_id
      |> Utility.map_values(&RankingsCalculator.calculate_stats_rank/1)
  end

  defp group_by_hero_id(hero_stats) do
    Enum.group_by(hero_stats, fn
      %{hero_id: nil} -> :totals
      %{hero_id: hero_id} -> hero_id
    end, &Map.delete(&1, :hero_id))
  end

  defp remove_totals_subobject(%{totals: totals}), do: totals
  defp remove_totals_subobject(stats), do: stats
end
