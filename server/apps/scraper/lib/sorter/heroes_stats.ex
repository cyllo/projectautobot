defmodule Scraper.Sorter.HeroesStats do
  alias Scarper.Sorter.Helpers

  @lifetime_statistics [
    :solo_kills, :eliminations,
    :time_spent_on_fire, :deaths,
    :environmental_deaths, :damage_done,
    :healing_done, :multikills,
    :final_blows, :objective_kills,
    :objective_time, :melee_final_blows,
    :environmental_kills
  ]

  @average_statistics [
    :solo_kills_average,
    :eliminations_average,
    :time_spent_on_fire_average,
    :deaths_average,
    :damage_done_average,
    :healing_done_avergage,
    :final_blows_average,
    :objective_kills_average,
    :objective_time_average,
    :melee_final_blows_average
  ]

  @best_statistics [
    :solo_kills_most_in_game,
    :eliminations_most_in_game,
    :time_spent_on_fire_most_in_game,
    :damage_done_most_in_game,
    :healing_done_most_in_game,
    :multikill_best,
    :final_blows_most_in_game,
    :objective_kills_most_in_game,
    :objective_time_most_in_game,
    :melee_final_blows_most_in_game
  ]

  @doc """
  organizes a hero statistic

  Returns `%{code, name, stats: %{average, best, lifetime, match_awards, game, hero_specific}}`.

  ## Examples

      iex> Scraper.Sorter.HeroesStats.sort_stats(%{ \
        code: "0x00000085", \
        name: "Ana", \
        stats: %{ \
          solo_kills_average: 1.91, \
          multikills: 2.95, \
          multikill_best: 3, \
          gold_medals: 3, \
          games_won: 3, \
          hero_specific_statistic: 32, \
          time_spent_on_fire: 32 \
        } \
      })
      %{code: "0x00000085", name: "Ana", \
        stats: %{\
          average: %{solo_kills_average: 1.91}, \
          best: %{multikill_best: 3}, \
          game: %{games_won: 3}, \
          lifetime: %{multikills: 2.95, time_spent_on_fire: 32}, \
          match_awards: %{gold_medals: 3}, \
          hero_specific: %{hero_specific_statistic: 32} \
        }}

  """
  def sort_stats(%{code: code, name: name, stats: stats}) do
    %{
      code: code,
      name: name,
      stats: Helpers.categorize_stats(stats, &get_stats_category/1)
    }
  end

  def sort_stats(stats) when is_list(stats), do: Enum.map stats, &sort_stats/1

  defp get_stats_category({key, _}) do
    cond do
      key in @lifetime_statistics -> :lifetime
      key in @best_statistics -> :best
      key in @average_statistics -> :average
      Helpers.is_match_award_stat?(key) -> :match_awards
      Helpers.is_game_tracking_stat?(key) -> :game
      Helpers.key_equals(key, "(time_played|win_percentage)") -> :game
      true -> :hero_specific
    end
  end
end
