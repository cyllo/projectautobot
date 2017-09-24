defmodule Api.Schema.StatisticTypes do
  use Absinthe.Schema.Notation

  object :combat_best_statistic do
    field :id, :integer

    field :eliminations_most_in_game, :integer
    field :critical_hits_most_in_game, :integer
    field :melee_final_blows_most_in_game, :integer
    field :defensive_assists_most_in_game, :integer
    field :offensive_assists_most_in_game, :integer
    field :final_blows_most_in_game, :integer
    field :solo_kills_most_in_game, :integer
    field :objective_kills_most_in_game, :integer
    field :objective_time_most_in_game, :integer
    field :time_spent_on_fire_most_in_game, :integer
    field :healing_done_most_in_game, :integer
    field :turrets_destroyed_most_in_game, :integer
    field :self_healing_most_in_game, :integer
    field :recon_assists_most_in_game, :integer
    field :damage_blocked_most_in_game, :integer
    field :melee_kills_most_in_game, :integer
    field :environmental_kills_most_in_game, :integer
    field :teleporter_pads_destroyed_most_in_game, :integer
    field :shield_generators_destroyed_most_in_game, :integer
    field :hero_damage_done_most_in_game, :integer
    field :barrier_damage_done_most_in_game, :integer

    field :all_damage_done_most_in_game, :integer
    field :all_damage_done_most_in_life, :integer
    field :hero_damage_done_most_in_life, :integer
    field :critical_hits_most_in_life, :integer
    field :eliminations_most_in_life, :integer

    field :kill_streak_best, :integer
    field :multikill_best, :integer
    field :scoped_accuracy_best_in_game_percentage, :decimal
    field :weapon_accuracy_best_in_game_percentage, :decimal
    field :damage_amplified_most_in_game, :integer
  end

  object :game_average_statistic do
    field :id, :integer

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
    field :damage_amplified_avg_per10_min, :decimal
    field :damage_amplified_average, :decimal
    field :damage_blocked_average, :decimal
    field :healing_done_most_in_life, :decimal
    field :self_healing_average, :decimal
    field :eliminations_average, :decimal
    field :solo_kills_average, :decimal
    field :environmental_deaths, :decimal
    field :offensive_assists_average, :decimal
    field :final_blows_average, :decimal
    field :time_spent_on_fire_average, :decimal
    field :deaths_average, :decimal
    field :objective_kills_average, :decimal
    field :objective_time_average, :decimal
    field :critical_hits_average, :decimal
    field :defensive_assists_average, :decimal
    field :healing_done_average, :decimal
    field :melee_final_blows_average, :decimal
  end

  object :combat_lifetime_statistic do
    field :id, :integer

    field :solo_kills, :integer
    field :eliminations, :integer
    field :eliminations_per_life, :decimal
    field :time_spent_on_fire, :integer
    field :deaths, :integer
    field :objective_kills, :integer
    field :objective_time, :integer
    field :environmental_kills, :integer
    field :all_damage_done, :integer
    field :critical_hits, :integer
    field :healing_done, :integer
    field :final_blows, :integer
    field :melee_final_blows, :integer
    field :multikills, :integer
    field :recon_assists, :integer
    field :teleporter_pads_destroyed, :integer
    field :shield_generators_destroyed, :integer
    field :damage_blocked, :integer
    field :melee_kills, :integer
    field :weapon_accuracy_percentage, :decimal
    field :critical_hits_accuracy_percentage, :decimal
    field :turrets_destroyed, :integer
    field :defensive_assists, :integer
    field :offensive_assists, :integer
    field :barrier_damage_done, :integer
    field :hero_damage_done, :integer
    field :scoped_accuracy_percentage, :decimal
    field :self_healing, :integer
    field :damage_amplified, :integer
    field :critical_hits_kills, :integer
    field :scoped_hits, :integer
  end

  object :match_awards_statistic do
    field :id, :integer

    field :bronze_medals, :integer
    field :silver_medals, :integer
    field :gold_medals, :integer
    field :total_medals, :integer
    field :cards, :integer
  end

  object :game_history_statistic do
    field :id, :integer

    field :games_played, :integer
    field :games_won, :integer
    field :games_lost, :integer
    field :time_played, :integer
    field :win_percentage, :decimal
  end

  object :hero_specific_statistic do
    field :id, :integer

    field :stats, :map
  end

  object :profile_statistic do
    field :competitive_level, :integer
    field :competitive_rank_url, :string
    field :competitive_bracket_name, :string
    field :level, :integer
    field :level_url, :string
    field :rank_url, :string
    field :total_games_won, :integer
  end
end
