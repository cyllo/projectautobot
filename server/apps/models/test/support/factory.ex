defmodule Models.Factory do
  alias Models.Repo
  alias Models.Game.GamerTag
  alias Models.Statistics.Snapshots.SnapshotStatistic
  alias Models.Statistics.{GameAverage, CombatBest, CombatLifetime, GameHistory}

  # Factories

  def build(:snapshot_statistic) do

  end

  def build(:gamer_tag) do
    %GamerTag{
      tag: "TeaMaster-11555",
      region: "us",
      platform: "pc"
    }
  end

  def build(:hero_snapshot_statistics) do

  end

  def build(:profile_snapshot_statistic) do
    %ProfileSnapshotStatistic{}
  end

  def build(:game_average_statistic) do
    %GameAverage{
      solo_kills_avg_per_10_min: random_integer(),
      defensive_assists_avg_per_10_min: random_integer(),
      time_spent_on_fire_avg_per_10_min: random_integer(),
      objective_time_avg_per_10_min: random_integer(),
      deaths_avg_per_10_min: random_integer(),
      self_healing_avg_per_10_min: random_integer(),
      offensive_assists_avg_per_10_min: random_integer(),
      final_blows_avg_per_10_min: random_integer(),
      critical_hits_avg_per_10_min: random_integer(),
      eliminations_avg_per_10_min: random_integer(),
      damage_blocked_avg_per_10_min: random_integer(),
      hero_damage_done_avg_per_10_min: random_integer(),
      barrier_damage_done_avg_per_10_min:  random_integer()
    }
  end

  def build(:combat_best_statistic) do
    %CombatBest{
      eliminations_most_in_life: random_integer(),
      eliminations_most_in_game: random_integer(),
      critical_hits_most_in_game: random_integer(),
      critical_hits_most_in_life: random_integer(),
      damage_done_most_in_game: random_integer(),
      damage_done_most_in_life: random_integer(),
      melee_final_blows_most_in_game: random_integer(),
      weapon_accuracy_best_in_game_percentage: random_integer(),
      kill_streak_best: random_integer(),
      environmental_kills_most_in_game: random_integer(),
      defensive_assists_most_in_game: random_integer(),
      offensive_assists_most_in_game: random_integer(),
      final_blows_most_in_game: random_integer(),
      solo_kills_most_in_game: random_integer(),
      objective_kills_most_in_game: random_integer(),
      objective_time_most_in_game: random_integer(),
      turrets_destroyed_most_in_game: random_integer(),
      time_spent_on_fire_most_in_game: random_integer(),
      healing_done_most_in_game: random_integer(),
      healing_done_most_in_life: random_integer(),
      self_healing_most_in_game: random_integer(),
      multikill_best: random_integer(),
      recon_assists_most_in_game: random_integer(),
      damage_blocked_most_in_game: random_integer(),
      melee_kills_most_in_game: random_integer(),
      all_damage_done_most_in_game: random_integer()
    }
  end

  def build(:combat_lifetime_statistic) do
    %CombatLifetime{
      solo_kills: random_integer(),
      eliminations: random_integer(),
      eliminations_per_life: random_decimal(),
      time_spent_on_fire: random_integer(),
      deaths: random_integer(),
      objective_kills: random_integer(),
      objective_time: random_integer(),
      environmental_kills: random_integer(),
      environmental_deaths: random_integer(),
      damage_done: random_integer(),
      shots_fired: random_integer(),
      shots_hit: random_integer(),
      critical_hits: random_integer(),
      healing_done: random_integer(),
      final_blows: random_integer(),
      melee_final_blows: random_integer(),
      multikills: random_integer(),
      recon_assists: random_integer(),
      teleporter_pads_destroyed: random_integer(),
      shield_generators_destroyed: random_integer(),
      damage_blocked: random_integer(),
      melee_kills: random_integer(),
      weapon_accuracy_percentage: random_integer(),
      critical_hits_accuracy_percentage: random_integer(),
      multikill_best: random_integer(),
      turrets_destroyed: random_integer(),
      defensive_assists: random_integer(),
      offensive_assists: random_integer(),
      barrier_damage_done: random_integer(),
      all_damage_done: random_integer(),
      hero_damage_done: random_integer(),
      time_holding_ultimate: random_integer(),
      ultimates_earned: random_integer(),
      ultimates_used: random_integer()
    }
  end

  def build(:game_history_statistic) do
    %GameHistory{
      games_tied: random_integer(),
      games_played: random_integer(),
      games_won: random_integer(),
      games_lost: random_integer(),
      time_played: random_integer(),
      time_spent_on_fire: random_integer(),
      win_percentage: random_decimal()
    }
  end

  def build(:hero_specific_statistic) do

  end

  def build(:match_award_statistic) do

  end

  def build(:profile_statistic) do

  end

  # Convenience API

  def build(factory_name, attributes) do
    factory_name |> build |> struct(attributes)
  end

  def build(factory_name, num, attributes) do
    Enum.map(0..num, fn -> build(factory_name, attributes) end)
  end

  def insert!(factory_name, attributes \\ []) do
    Repo.insert! build(factory_name, attributes)
  end

  defp random_decimal, do: Decimal.new("#{:rand.uniform(200)}.#{:rand.uniform(999)}")
  defp random_integer, do: :rand.uniform(200)
end
