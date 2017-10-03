defmodule StatsLeaderboard.RankingsCalculator do
  def calculate_stats_rank(stats) do
    stats
      |> Enum.reduce(%{}, &organize_stat_with_gamer_tag_id/2)
      |> Enum.map(&sort_grouped_stats_by_value/1)
      |> Enum.reduce(%{}, &add_stat_to_rankings/2)
  end

  defp add_stat_to_rankings({stat_name, stats}, rankings) do
    Map.put(rankings, stat_name, rank_stats_by_gamer_tag(stats))
  end

  defp rank_stats_by_gamer_tag(stats) do
    for {{gamer_tag_id, value}, index} <- Enum.with_index(stats), into: %{} do
      {gamer_tag_id, %{rank: index + 1, value: value}} # plus one so we don't start at 0
    end
  end

  defp sort_grouped_stats_by_value({stat_name, stat_values}) do
    sorted_stat_values = Enum.sort_by(stat_values, fn {_, value} -> value end, &stat_greater_than/2)

    {stat_name, sorted_stat_values}
  end

  defp stat_greater_than(_, nil), do: true
  defp stat_greater_than(nil, _), do: false
  defp stat_greater_than(%Decimal{} = a, %Decimal{} = b) do
    case Decimal.cmp(a, b) do
      :lt -> false
      _ -> true
    end
  end

  defp stat_greater_than(a, b), do: a >= b

  defp organize_stat_with_gamer_tag_id(stats, stat_groups) when is_map(stats) do
    stats
      |> Map.to_list
      |> organize_stat_with_gamer_tag_id(stat_groups)
  end

  defp organize_stat_with_gamer_tag_id(stats, stat_groups) do
    gamer_tag_id = Keyword.get(stats, :gamer_tag_id)

    stats
      |> Keyword.delete(:gamer_tag_id)
      |> Enum.reduce(stat_groups, fn {stat_name, stat_value}, acc ->
        item = {gamer_tag_id, stat_value}

        Map.update(acc, stat_name, [item], &(&1 ++ [item]))
      end)
  end
end
