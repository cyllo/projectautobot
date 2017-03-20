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
      Helpers.is_average_stat?(key) -> :average
      Helpers.is_most_in_game_or_life_stat?(key) -> :best
      Helpers.is_multikill_best_stat?(key) -> :best
      Helpers.is_match_award_stat?(key) -> :match_awards
      Helpers.is_game_tracking_stat?(key) -> :game
      Helpers.key_equals(key, "(time_played|win_percentage)") -> :game
      true -> :hero_specific
    end
  end
end
