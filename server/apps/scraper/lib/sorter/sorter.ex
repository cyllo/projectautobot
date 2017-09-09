defmodule Scraper.Sorter do
  import Logger, only: [info: 1, warn: 1]

  alias Scraper.Sorter.Stats

  def sort_stats(params) do
    info "Sorting #{params.gamer_tag} stats"

    %{params |
      competitive: sort_hero_and_total_stats(params.competitive),
      quickplay: sort_hero_and_total_stats(params.quickplay)
    }
  end

  defp sort_hero_and_total_stats(stats) do
    heroes_stats = sort_hero_stats(stats.heroes_stats)
    total_stats = Stats.sort_total(stats.total_stats)

    log_duplicated_stats(heroes_stats)

    %{stats |
      heroes_stats: heroes_stats,
      total_stats: total_stats
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
      warn "Duplicated stats in hero hero specific: #{inspect stats}"
    end
  end

  def duplicated_hero_specific_stats(stats) do
    stats
      |> Utility.pluck(:stats)
      |> Utility.pluck(:hero_specific)
      |> Utility.compact
      |> count_key_occurrences
  end

  defp count_key_occurrences(map_list) do
    Enum.reduce(map_list, %{}, fn list, acc ->
      key_count = Enum.map(list, fn {k, _} -> {k, 1} end) |> Map.new

      Map.merge(acc, key_count, fn _, a, b -> a + b end)
    end)
  end
end
