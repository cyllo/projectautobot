defmodule Api.Schema.StatisticAverageTypes do
  use Absinthe.Schema.Notation

  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]

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
    field :scoped_accuracy_best_in_game_percentage, :integer
  end

  object :game_average_statistic_average do
    field :solo_kills_avg_per10_min, :decimal
    field :defensive_assists_avg_per10_min, :decimal
    field :time_spent_on_fire_avg_per10_min, :decimal
    field :objective_time_avg_per10_min, :decimal
    field :deaths_avg_per10_min, :decimal
    field :self_healing_avg_per10_min, :decimal
    field :offensive_assists_avg_per10_min, :decimal
    field :final_blows_avg_per10_min, :decimal
    field :critical_hits_avg_per10_min, :decimal
    field :eliminations_avg_per10_min, :decimal
    field :damage_blocked_avg_per10_min, :decimal
    field :hero_damage_done_avg_per10_min, :decimal
    field :barrier_damage_done_avg_per10_min, :decimal
    field :healing_done_avg_per10_min, :decimal
    field :all_damage_done_avg_per10_min, :decimal
    field :objective_kills_avg_per10_min, :decimal
    field :melee_final_blows_avg_per10_min, :decimal
  end

  object :combat_lifetime_statistic_average do
    field :scoped_accuracy_percentage, :decimal
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
