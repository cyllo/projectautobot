defmodule StatsLeaderboard.LeaderboardFilters do
  alias StatsLeaderboard.PlatformRankingCalculator

  def filter_by(leaderboard, totals_profile_function) when is_list(leaderboard), do: Enum.map(leaderboard, &filter_by(&1, totals_profile_function))
  def filter_by(leaderboard, totals_profile_function) when is_function(totals_profile_function) do
    leaderboard
      |> Map.update!(:profile_stats_rankings, totals_profile_function)
      |> Map.update!(:hero_quickplay_rankings, &Utility.map_values(&1, totals_profile_function))
      |> Map.update!(:hero_competitive_rankings, &Utility.map_values(&1, totals_profile_function))
      |> Map.update!(:hero_total_quickplay_rankings, totals_profile_function)
      |> Map.update!(:hero_total_competitive_rankings, totals_profile_function)
  end

  def filter_by(leaderboard, params) when is_map(params), do: filter_by(leaderboard, Map.to_list(params))
  def filter_by(leaderboard, params) when is_list(params) do
    Enum.reduce(params, leaderboard, fn {filter_key, param}, acc ->
      filter(acc, filter_key, param)
    end)
  end

  def filter_by(leaderboard, _), do: leaderboard

  def filter(leaderboard, :rank_by, %{platform: platform} = params) do
    filter_by(leaderboard, fn stats ->
      PlatformRankingCalculator.rerank_by_platform(stats, platform, Map.get(params, :region, ""))
    end)
  end

  def filter(leaderboard, :gamer_tag_id, gamer_tag_id) do
    leaderboard
      |> filter_by(&Utility.map_values(&1, get_gamer_tag_id(gamer_tag_id)))
  end

  def filter(leaderboard, :statistics_props, props) do
    filter_by(leaderboard, &Map.take(&1, props))
  end

  def filter(leaderboard, _, _) do
    leaderboard
  end

  defp get_gamer_tag_id(id, default \\ nil)
  defp get_gamer_tag_id(id, default) when is_integer(id), do: Integer.to_string(id) |> get_gamer_tag_id(default)
  defp get_gamer_tag_id(id, default), do: fn rankings -> Map.put(%{}, id, Map.get(rankings, id, default)) end
end
