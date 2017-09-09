defmodule Api.Schema.StatisticTypes do
  use Absinthe.Schema.Notation

  object :combat_best_statistic do
    field :id, :integer

    field :eliminations_most_in_life, :integer
    field :eliminations_most_in_game, :integer
    field :critical_hits_most_in_game, :integer
    field :critical_hits_most_in_life, :integer
    field :damage_done_most_in_game, :integer
    field :damage_done_most_in_life, :integer
    field :melee_final_blows_most_in_game, :integer
    field :weapon_accuracy_best_in_game_percentage, :integer
    field :kill_streak_best, :integer
    field :defensive_assists_most_in_game, :integer
    field :offensive_assists_most_in_game, :integer
    field :final_blows_most_in_game, :integer
    field :solo_kills_most_in_game, :integer
    field :objective_kills_most_in_game, :integer
    field :objective_time_most_in_game, :integer
    field :time_spent_on_fire_most_in_game, :integer
    field :healing_done_most_in_game, :integer
    field :healing_done_most_in_life, :integer
    field :turrets_destroyed_most_in_game, :integer
    field :self_healing_most_in_game, :integer
    field :multikill_best, :integer
    field :recon_assists_most_in_game, :integer
    field :damage_blocked_most_in_game, :integer
    field :melee_kills_most_in_game, :integer

    field :scoped_accuracy_best_in_game_percentage, :integer

    field :ultimates_used, :integer
    field :ultimates_earned, :integer
    field :time_holding_ultimate, :integer
    field :hero_damage_done, :integer
    field :barrier_damage_done, :integer
    field :all_damage_done, :integer
    field :damage_blocked, :integer
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
  end

  object :combat_lifetime_statistic do
    field :id, :integer

    field :scoped_accuracy_percentage, :integer
    field :solo_kills, :integer
    field :eliminations, :integer
    field :eliminations_per_life, :decimal
    field :time_spent_on_fire, :integer
    field :deaths, :integer
    field :objective_kills, :integer
    field :objective_time, :integer
    field :environmental_kills, :integer
    field :environmental_deaths, :integer
    field :damage_done, :integer
    field :shots_fired, :integer
    field :shots_hit, :integer
    field :critical_hits, :integer
    field :healing_done, :integer
    field :final_blows, :integer
    field :melee_final_blows, :integer
    field :multikills, :integer
    field :recon_assists, :integer
    field :teleporter_pads_destroyed, :integer
    field :damage_blocked, :integer
    field :melee_kills, :integer
    field :weapon_accuracy_percentage, :integer
    field :critical_hits_accuracy_percentage, :integer
    field :multikill_best, :integer
    field :turrets_destroyed, :integer
    field :defensive_assists, :integer
    field :offensive_assists, :integer
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
    field :time_spent_on_fire, :integer
    field :win_percentage, :integer
  end

  object :hero_specific_statistic do
    field :id, :integer

    field :stats, :map
  end

  object :profile_statistic do
    field :competitive_level, :integer
    field :competitive_rank_url, :string
    field :level, :integer
    field :level_url, :string
    field :rank_url, :string
    field :total_games_won, :integer
  end
end
