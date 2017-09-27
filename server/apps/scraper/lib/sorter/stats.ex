defmodule Scraper.Sorter.Stats do
  alias Scraper.Sorter.Helpers

  @lifetime_statistics [
    :solo_kills, :eliminations,
    :time_spent_on_fire, :deaths,
    :healing_done, :multikills, :offensive_assists,
    :final_blows, :objective_kills,
    :objective_time, :melee_final_blows,
    :environmental_kills, :eliminations_per_life,
    :critical_hits, :defensive_assists,
    :critical_hits_accuracy_percentage,
    :weapon_accuracy_percentage, :self_healing,
    :teleporter_pads_destroyed, :all_damage_done,
    :damage_blocked, :hero_damage_done, :melee_kills,
    :barrier_damage_done,  :turrets_destroyed,
    :scoped_accuracy_percentage, :recon_assists,
    :shield_generators_destroyed, :damage_amplified,
    :critical_hits_kills, :scoped_hits
  ]

  @average_statistics [
    :melee_final_blows_avg_per10_min,
    :barrier_damage_done_avg_per10_min, :objective_kills_avg_per10_min,
    :solo_kills_avg_per10_min, :defensive_assists_avg_per10_min,
    :time_spent_on_fire_avg_per10_min, :objective_time_avg_per10_min,
    :deaths_avg_per10_min, :self_healing_avg_per10_min,
    :offensive_assists_avg_per10_min, :final_blows_avg_per10_min,
    :critical_hits_avg_per10_min, :eliminations_avg_per10_min,
    :damage_blocked_avg_per10_min, :hero_damage_done_avg_per10_min,
    :healing_done_avg_per10_min, :all_damage_done_avg_per10_min,
    :damage_amplified_avg_per10_min, :damage_amplified_average,
    :damage_blocked_average, :healing_done_most_in_life,
    :self_healing_average, :eliminations_average,
    :solo_kills_average, :environmental_deaths,
    :offensive_assists_average, :final_blows_average,
    :time_spent_on_fire_average, :deaths_average,
    :objective_kills_average, :objective_time_average,
    :critical_hits_average, :defensive_assists_average,
    :healing_done_average, :melee_final_blows_average
  ]

  @best_statistics [
    :weapon_accuracy_best_in_game_percentage, :scoped_accuracy_best_in_game_percentage,
    :multikill_best, :kill_streak_best, :teleporter_pads_destroyed_most_in_game,
    :hero_damage_done_most_in_life, :all_damage_done_most_in_life,
    :eliminations_most_in_life, :critical_hits_most_in_life,
    :turrets_destroyed_most_in_game, :hero_damage_done_most_in_game,
    :critical_hits_most_in_game, :environmental_kills_most_in_game,
    :damage_blocked_most_in_game, :melee_kills_most_in_game,
    :defensive_assists_most_in_game, :eliminations_most_in_game,
    :final_blows_most_in_game, :objective_kills_most_in_game,
    :healing_done_most_in_game, :barrier_damage_done_most_in_game,
    :offensive_assists_most_in_game, :objective_time_most_in_game,
    :melee_final_blows_most_in_game, :recon_assists_most_in_game,
    :all_damage_done_most_in_game, :shield_generators_destroyed_most_in_game,
    :self_healing_most_in_game, :solo_kills_most_in_game,
    :time_spent_on_fire_most_in_game, :damage_amplified_most_in_game
  ]

  def sort(stats), do: Helpers.categorize_stats(stats, &get_stats_category/1)
  def sort_total(stats), do: stats |> sort |> Map.delete(:hero_specific)

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
