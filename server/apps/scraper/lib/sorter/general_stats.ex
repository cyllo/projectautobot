defmodule Scraper.Sorter.GeneralStats do
  alias Scarper.Sorter.Helpers
  import Logger, only: [warn: 1]

  @lifetime_statistics [
    :eliminations, :final_blows,
    :solo_kills, :objective_kills,
    :shots_fired, :shots_hit,
    :critical_hits, :recon_assists,
    :critical_hits_accuracy_percentage, :damage_done,
    :melee_final_blows, :eliminations_per_life,
    :weapon_accuracy_percentage, :objective_time,
    :deaths, :environmental_deaths,
    :multikill_best, :defensive_assists,
    :healing_done, :environmental_kills,
    :turrets_destroyed, :offensive_assists,
    :multikills, :teleporter_pads_destroyed,
    :shield_generators_destroyed,
    :ultimates_used, :ultimates_earned,
    :time_holding_ultimate, :hero_damage_done,
    :barrier_damage_done, :all_damage_done, :damage_blocked
  ]

  @average_statistics [
    :eliminations_average, :final_blows_average,
    :solo_kills_average, :objective_kills_average,
    :melee_final_blows_average, :objective_time_average,
    :healing_done_average, :deaths_average,
    :time_spent_on_fire_average, :critical_hits_average,
    :damage_done_average, :melee_percentage_of_final_blows, :weapon_accuracy,
    :all_damage_done_avg_per_10_min
  ]

  @best_statistics [
    :eliminations_most_in_life, :eliminations_most_in_game,
    :final_blows_most_in_game, :solo_kills_most_in_game,
    :objective_kills_most_in_game, :critical_hits_most_in_game,
    :critical_hits_most_in_life, :damage_done_most_in_life,
    :damage_done_most_in_game, :melee_final_blows_most_in_game,
    :weapon_accuracy_best_in_game_percentage,
    :objective_time_most_in_game, :kill_streak_best,
    :healing_done_most_in_game, :defensive_assists_most_in_game,
    :offensive_assists_most_in_game, :time_spent_on_fire_most_in_game,
    :recon_assists_most_in_game, :environmental_kills_most_in_game,
    :shield_generators_destroyed_most_in_game, :teleporter_pads_destroyed_most_in_game,
    :turrets_destroyed_most_in_game, :all_damage_done_most_in_game
  ]

  @doc """
  sorts a general statistic

  Returns `%{code, name, stats: %{average, best, lifetime}}`.

  ## Examples

      iex> Scraper.Sorter.GeneralStats.sort_stats(%{ \
        time_spent_on_fire: 32, \
        weapon_accuracy_best_in_game_percentage: 5, \
        medals_gold: 263, \
        objective_kills_average: 4.44, \
        multikill_best: 5 \
      })
      %{ \
        match_awards: %{medals_gold: 263}, \
        average: %{objective_kills_average: 4.44}, \
        lifetime: %{multikill_best: 5}, \
        best: %{weapon_accuracy_best_in_game_percentage: 5}, \
        game: %{time_spent_on_fire: 32}
      }

  """
  def sort_stats(stats) when is_list(stats), do: Enum.map(stats, &sort_stats/1)
  def sort_stats(stats), do: Helpers.categorize_stats(stats, &get_stats_category/1)

  defp get_stats_category({key, _}) do
    cond do
      Regex.match?(~r/^of_[a-z']+_[a-z']+(_[a-z']+)?$/i, Atom.to_string(key)) -> nil
      key in @lifetime_statistics -> :lifetime
      key in @average_statistics -> :average
      key in @best_statistics -> :best
      Helpers.is_match_award_stat?(key) -> :match_awards
      Helpers.is_game_tracking_stat?(key) -> :game
      Utility.key_equals(key, "(time_played|win_percentage|time_spent_on_fire)") -> :game
      true ->
        warn "#{key} is not known to general stats sorter"
        nil
    end
  end
end
