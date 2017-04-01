defmodule Scraper.Sorter.GeneralStats do
  alias Scarper.Sorter.Helpers

  @lifetime_statistics [
    :eliminations, :final_blows,
    :solo_kills, :objective_kills,
    :shots_fired, :shots_hit,
    :critical_hits, :critical_hits_per_minute,
    :critical_hit_accuracy, :damage_done,
    :melee_final_blows, :eliminations_per_life,
    :weapon_accuracy, :objective_time,
    :deaths, :environmental_deaths,
    :multikill_best
  ]

  @doc """
  sorts a general statistic

  Returns `%{code, name, stats: %{average, best, lifetime}}`.

  ## Examples

      iex> Scraper.Sorter.GeneralStats.sort_stats(%{ \
        time_spent_on_fire: 32, \
        weapon_accuracy_best_in_game: 5, \
        medals_gold: 263, \
        objective_kills_average: 4.44, \
        multikill_best: 5 \
      })
      %{ \
        match_awards: %{medals_gold: 263}, \
        average: %{objective_kills_average: 4.44}, \
        lifetime: %{multikill_best: 5}, \
        best: %{weapon_accuracy_best_in_game: 5}, \
        game: %{time_spent_on_fire: 32}
      }

  """
  def sort_stats(stats) when is_list(stats), do: Enum.map(stats, &sort_stats/1)
  def sort_stats(stats), do: Helpers.categorize_stats(stats, &get_stats_category/1)

  defp get_stats_category({key, _}) do
    cond do
      key in @lifetime_statistics -> :lifetime
      Helpers.is_average_stat?(key) -> :average
      Helpers.key_equals(key, "weapon_accuracy_best_in_game") -> :best
      Helpers.is_most_in_game_or_life_stat?(key) -> :best
      Helpers.is_multikill_best_stat?(key) -> :lifetime
      Helpers.is_match_award_stat?(key) -> :match_awards
      Helpers.is_game_tracking_stat?(key) -> :game
      Helpers.key_equals(key, "(time_played|win_percentage|time_spent_on_fire)") -> :game
      true -> :hero_specific
    end
  end
end
