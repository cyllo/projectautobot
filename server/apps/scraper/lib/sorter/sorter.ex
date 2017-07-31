defmodule Scraper.Sorter do
  alias Scraper.Sorter.Stats
  require Logger

  def sort_stats(params) do
    Logger.info "Sorting #{params.gamer_tag} stats"

    %{params |
      competitive: sort_hero_and_general_stats(params.competitive),
      quickplay: sort_hero_and_general_stats(params.quickplay)
    }
  end

  defp sort_hero_and_general_stats(stats) do
    heroes_stats = sort_hero_stats(stats.heroes_stats)
    general_stats = Stats.sort_general(stats.general_stats)

    log_duplicated_stats(heroes_stats)

    %{stats |
      heroes_stats: heroes_stats,
      general_stats: general_stats
    }
  end

  defp sort_hero_stats(stats) do
    Enum.map(stats, fn item ->
      Map.update!(item, :stats, &Stats.sort/1)
    end)
  end

  defp log_duplicated_stats(heroes_stats) do
    stats = duplicated_hero_specific_stats(heroes_stats)
      |> Enum.filter(fn {_, v} -> v > 1 end)
      |> Keyword.keys

    if Enum.any?(stats) do
      Logger.warn "Duplicated stats in hero hero specific: #{inspect stats}"
    end
  end

  def duplicated_hero_specific_stats(stats) do
    stats
      |> Utility.pluck(:stats)
      |> Utility.pluck(:hero_specific)
      |> count_key_occurrences
  end

  defp count_key_occurrences(map_list) do
    Enum.reduce(map_list, %{}, fn list, acc ->
      key_count = Enum.map(list, fn {k, _} -> {k, 1} end) |> Map.new

      Map.merge(acc, key_count, fn _, a, b -> a + b end)
    end)
  end
end
