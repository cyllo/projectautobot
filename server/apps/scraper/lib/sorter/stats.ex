defmodule Scraper.Sorter.Stats do
  alias Scarper.Sorter.Helpers

  @lifetime_statistics [
    :solo_kills, :eliminations,
    :time_spent_on_fire, :deaths,
    :damage_done, :environmental_deaths,
    :healing_done, :multikills, :offensive_assists,
    :final_blows, :objective_kills,
    :objective_time, :melee_final_blows,
    :environmental_kills, :eliminations_per_life,
    :critical_hits, :shots_fired, :defensive_assists,
    :critical_hits_accuracy_percentage, :shots_hit,
    :weapon_accuracy_percentage, :self_healing, :turrets_destroyed,
    :teleporter_pads_destroyed, :damage_blocked, :melee_kills,
    :ultimates_used, :ultimates_earned,
    :time_holding_ultimate, :hero_damage_done,
    :barrier_damage_done, :all_damage_done, :damage_blocked
  ]

  @average_statistics [
    :solo_kills_average, :eliminations_average,
    :time_spent_on_fire_average, :deaths_average,
    :damage_done_average, :self_healing_average,
    :healing_done_average, :final_blows_average,
    :objective_kills_average, :objective_time_average,
    :melee_final_blows_average, :offensive_assists_average,
    :critical_hits_average, :defensive_assists_average,
    :damage_blocked_average, :melee_kills_average,
    :melee_percentage_of_final_blows, :weapon_accuracy,
    :all_damage_done_avg_per_10_min, :healing_done_avg_per_10_min,
    :objective_kills_avg_per_10_min
  ]

  @best_statistics [
    :solo_kills_most_in_game, :time_spent_on_fire_most_in_game,
    :damage_done_most_in_game, :damage_done_most_in_life,
    :healing_done_most_in_game, :multikill_best,
    :final_blows_most_in_game, :objective_kills_most_in_game,
    :objective_time_most_in_game, :melee_final_blows_most_in_game,
    :kill_streak_best, :offensive_assists_most_in_game,
    :self_healing_most_in_game, :critical_hits_most_in_life,
    :critical_hits_most_in_game, :healing_done_most_in_life,
    :defensive_assists_most_in_game, :eliminations_most_in_life,
    :eliminations_most_in_game, :weapon_accuracy_best_in_game_percentage,
    :damage_blocked_most_in_game, :melee_kills_most_in_game,
    :recon_assists_most_in_game, :all_damage_done_most_in_game,
    :all_damage_done_most_in_life
  ]

  def sort(stats), do: Helpers.categorize_stats(stats, &get_stats_category/1)
  def sort_general(stats), do: stats |> sort |> Map.delete(:hero_specific)

  defp get_stats_category({key, _}) do
    cond do
      Regex.match?(~r/^of_[a-z']+_[a-z']+(_[a-z']+)?$/i, Atom.to_string(key)) -> nil
      key in @lifetime_statistics -> :lifetime
      key in @best_statistics -> :best
      key in @average_statistics -> :average
      Helpers.is_match_award_stat?(key) -> :match_awards
      Helpers.is_game_tracking_stat?(key) -> :game
      Utility.key_equals(key, "(time_played|win_percentage)") -> :game
      true -> :hero_specific
    end
  end
end
