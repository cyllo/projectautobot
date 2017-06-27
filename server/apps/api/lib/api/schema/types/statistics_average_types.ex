defmodule Api.Schema.StatisticAverageTypes do
  use Absinthe.Schema.Notation

  object :combat_best_statistic_average do
    field :eliminations_most_in_life, :decimal
    field :eliminations_most_in_game, :decimal
    field :critical_hits_most_in_game, :decimal
    field :critical_hits_most_in_life, :decimal
    field :damage_done_most_in_game, :decimal
    field :damage_done_most_in_life, :decimal
    field :melee_final_blows_most_in_game, :decimal
    field :weapon_accuracy_best_in_game_percentage, :decimal
    field :kill_streak_best, :decimal
    field :defensive_assists_most_in_game, :decimal
    field :offensive_assists_most_in_game, :decimal
    field :final_blows_most_in_game, :decimal
    field :solo_kills_most_in_game, :decimal
    field :objective_kills_most_in_game, :decimal
    field :objective_time_most_in_game, :decimal
    field :time_spent_on_fire_most_in_game, :decimal
    field :healing_done_most_in_game, :decimal
    field :healing_done_most_in_life, :decimal
    field :turrets_destroyed_most_in_game, :decimal
    field :self_healing_most_in_game, :decimal
    field :multikill_best, :decimal
    field :recon_assists_most_in_game, :decimal
    field :damage_blocked_most_in_game, :decimal
    field :melee_kills_most_in_game, :decimal
  end

  object :combat_average_statistic_average do
    field :critical_hits_average, :decimal
    field :damage_done_average, :decimal
    field :deaths_average, :decimal
    field :defensive_assists_average, :decimal
    field :eliminations_average, :decimal
    field :final_blows_average, :decimal
    field :healing_done_average, :decimal
    field :melee_final_blows_average, :decimal
    field :objective_kills_average, :decimal
    field :objective_time_average, :decimal
    field :offensive_assists_average, :decimal
    field :self_healing_average, :decimal
    field :solo_kills_average, :decimal
    field :time_spent_on_fire_average, :decimal
    field :damage_blocked_average, :decimal
    field :melee_kills_average, :decimal
  end

  object :combat_lifetime_statistic_average do
    field :solo_kills, :decimal
    field :eliminations, :decimal
    field :eliminations_per_life, :decimal
    field :time_spent_on_fire, :decimal
    field :deaths, :decimal
    field :objective_kills, :decimal
    field :objective_time, :decimal
    field :environmental_kills, :decimal
    field :environmental_deaths, :decimal
    field :damage_done, :decimal
    field :shots_fired, :decimal
    field :shots_hit, :decimal
    field :critical_hits, :decimal
    field :healing_done, :decimal
    field :final_blows, :decimal
    field :melee_final_blows, :decimal
    field :multikills, :decimal
    field :recon_assists, :decimal
    field :teleporter_pads_destroyed, :decimal
    field :damage_blocked, :decimal
    field :melee_kills, :decimal
    field :weapon_accuracy_percentage, :decimal
    field :critical_hits_accuracy_percentage, :decimal
    field :multikill_best, :decimal
    field :turrets_destroyed, :decimal
    field :defensive_assists, :decimal
    field :offensive_assists, :decimal
  end

  object :match_awards_statistic_average do
    field :bronze_medals, :decimal
    field :silver_medals, :decimal
    field :gold_medals, :decimal
    field :total_medals, :decimal
    field :cards, :decimal
  end

  object :game_history_statistic_average do
    field :games_played, :decimal
    field :games_won, :decimal
    field :games_lost, :decimal
    field :time_played, :decimal
    field :time_spent_on_fire, :decimal
    field :win_percentage, :decimal
  end

  object :hero_specific_statistic_average do
    field :stats, :map
  end
end