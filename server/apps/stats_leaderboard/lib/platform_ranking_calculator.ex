defmodule StatsLeaderboard.PlatformRankingCalculator do
  alias Models.{Repo, Game.GamerTag}

  def rerank_by_platform(stats, platform, region) do
    Utility.map_values(stats, &rerank_gamer_tag_object(&1, platform, region))
  end

  defp rerank_gamer_tag_object(gamer_tag_obj, platform, region) do
    gamer_tag_obj
      |> add_gamer_tag
      |> filter_by_platform_region(platform, region)
      |> Enum.sort_by(&Map.get(&1, "rank", 0))
      |> rank_new_index
  end

  defp filter_by_platform_region(items, "pc", "") do
    Enum.filter(items, &(&1.gamer_tag.platform === "pc"))
  end

  defp filter_by_platform_region(items, platform, region) do
    Enum.filter(items, &(&1.gamer_tag.platform === platform and &1.gamer_tag.region === region))
  end

  defp add_gamer_tag(gamer_tag_obj) do
    gamer_tag_obj
      |> Map.to_list
      |> Enum.map(fn {gamer_tag_id, rank} ->
        Map.put(rank, :gamer_tag, Repo.get(GamerTag, gamer_tag_id))
      end)
  end

  defp rank_new_index(leaderboard) do
    leaderboard
      |> Enum.with_index
      |> Enum.reduce(%{}, fn ({item, index}, acc) ->
        Map.put(acc, item.gamer_tag.id, add_item_rank_by_index(item, index))
      end)
  end

  defp add_item_rank_by_index(item, index) do
    item
      |> Map.delete(:gamer_tag)
      |> Map.put("rank", index + 1)
  end
end
