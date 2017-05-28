defmodule Models.Statistics.Snapshots.LatestSnapshotStatistic do
  use Models.Model
  alias Models.Repo
  alias Models.Statistics.Snapshots.{LatestSnapshotStatistic, HeroStatistic, AllHeroesStatistic}
  alias Models.Statistics.{HeroSpecific, CombatAverage, CombatBest, CombatLifetime, GameHistory, MatchAward}

  schema "latest_snapshot_statistics" do
    field :is_competitive, :boolean
    belongs_to :gamer_tag, Models.Game.GamerTag
    has_many :hero_snapshot_statistics, Models.Statistics.Snapshots.HeroStatistic, foreign_key: :snapshot_statistic_id
    has_one :all_heroes_snapshot_statistics, Models.Statistics.Snapshots.AllHeroesStatistic, foreign_key: :snapshot_statistic_id

    timestamps()
  end

  def aggrigate(opts \\ [competitive?: true]) do
    is_competitive = Keyword.get(opts, :competitive?)
    ahs_query = from(ahs in AllHeroesStatistic, preload: ^statistics_table_query())

    from(lss in LatestSnapshotStatistic,
      where: [is_competitive: ^is_competitive],
      preload: [
        hero_snapshot_statistics: ^hero_statistics_table_query(),
        all_heroes_snapshot_statistics: ^ahs_query
      ]
    ) |> Repo.one
  end

  def get_hero_aggregate(hero_id, opts \\ [competitive?: true])
  def get_hero_aggregate(hero_id, opts) do
    is_competitive = Keyword.get(opts, :competitive?, false)

    from(lss in LatestSnapshotStatistic,
      where: [is_competitive: ^is_competitive],
      preload: [
        hero_snapshot_statistics: ^hero_statistics_table_query(hero_id: hero_id)
      ]
    ) |> Repo.one |> Map.get(:hero_snapshot_statistics) |> List.first
  end

  defp hero_specific_table_query do
    from(ss in HeroSpecific)
  end

  defp hero_statistics_table_query(query \\ nil) do
    from(hs in HeroStatistic, where: ^query, preload: [
      :hero,
      hero_specific_statistic: ^hero_specific_table_query(),
      combat_average_statistic: ^from(ca in CombatAverage,
        group_by: ca.id,
        select: %{
          id: ca.id,
          critical_hits_average: avg(ca.critical_hits_average),
          damage_done_average: avg(ca.damage_done_average),
          deaths_average: avg(ca.deaths_average),
          defensive_assists_average: avg(ca.defensive_assists_average),
          eliminations_average: avg(ca.eliminations_average),
          final_blows_average: avg(ca.final_blows_average),
          healing_done_average: avg(ca.healing_done_average),
          melee_final_blows_average: avg(ca.melee_final_blows_average),
          objective_kills_average: avg(ca.objective_kills_average),
          objective_time_average: avg(ca.objective_time_average),
          offensive_assists_average: avg(ca.offensive_assists_average),
          self_healing_average: avg(ca.self_healing_average),
          solo_kills_average: avg(ca.solo_kills_average),
          time_spent_on_fire_average: avg(ca.time_spent_on_fire_average),
          damage_blocked_average: avg(ca.damage_blocked_average),
          melee_kills_average: avg(ca.melee_kills_average)
        }
      ),

      combat_best_statistic: ^from(cb in CombatBest,
        group_by: cb.id,
        select: %{
          id: cb.id,
          eliminations_most_in_life: avg(cb.eliminations_most_in_life),
          eliminations_most_in_game: avg(cb.eliminations_most_in_game),
          critical_hits_most_in_game: avg(cb.critical_hits_most_in_game),
          critical_hits_most_in_life: avg(cb.critical_hits_most_in_life),
          damage_done_most_in_game: avg(cb.damage_done_most_in_game),
          damage_done_most_in_life: avg(cb.damage_done_most_in_life),
          melee_final_blows_most_in_game: avg(cb.melee_final_blows_most_in_game),
          weapon_accuracy_best_in_game_percentage: avg(cb.weapon_accuracy_best_in_game_percentage),
          kill_streak_best: avg(cb.kill_streak_best),
          environmental_kills_most_in_game: avg(cb.environmental_kills_most_in_game),
          defensive_assists_most_in_game: avg(cb.defensive_assists_most_in_game),
          offensive_assists_most_in_game: avg(cb.offensive_assists_most_in_game),
          final_blows_most_in_game: avg(cb.final_blows_most_in_game),
          solo_kills_most_in_game: avg(cb.solo_kills_most_in_game),
          objective_kills_most_in_game: avg(cb.objective_kills_most_in_game),
          objective_time_most_in_game: avg(cb.objective_time_most_in_game),
          turrets_destroyed_most_in_game: avg(cb.turrets_destroyed_most_in_game),
          time_spent_on_fire_most_in_game: avg(cb.time_spent_on_fire_most_in_game),
          healing_done_most_in_game: avg(cb.healing_done_most_in_game),
          healing_done_most_in_life: avg(cb.healing_done_most_in_life),
          self_healing_most_in_game: avg(cb.self_healing_most_in_game),
          multikill_best: avg(cb.multikill_best),
          recon_assists_most_in_game: avg(cb.recon_assists_most_in_game),
          damage_blocked_most_in_game: avg(cb.damage_blocked_most_in_game),
          melee_kills_most_in_game: avg(cb.melee_kills_most_in_game)
        }
      ),

      combat_lifetime_statistic: ^from(cl in CombatLifetime,
        group_by: cl.id,
        select: %{
          id: cl.id,
          solo_kills: avg(cl.solo_kills),
          eliminations: avg(cl.eliminations),
          eliminations_per_life: avg(cl.eliminations_per_life),
          time_spent_on_fire: avg(cl.time_spent_on_fire),
          deaths: avg(cl.deaths),
          objective_kills: avg(cl.objective_kills),
          objective_time: avg(cl.objective_time),
          environmental_kills: avg(cl.environmental_kills),
          environmental_deaths: avg(cl.environmental_deaths),
          damage_done: avg(cl.damage_done),
          shots_fired: avg(cl.shots_fired),
          shots_hit: avg(cl.shots_hit),
          critical_hits: avg(cl.critical_hits),
          healing_done: avg(cl.healing_done),
          final_blows: avg(cl.final_blows),
          melee_final_blows: avg(cl.melee_final_blows),
          multikills: avg(cl.multikills),
          recon_assists: avg(cl.recon_assists),
          teleporter_pads_destroyed: avg(cl.teleporter_pads_destroyed),
          damage_blocked: avg(cl.damage_blocked),
          melee_kills: avg(cl.melee_kills),
          weapon_accuracy_percentage: avg(cl.weapon_accuracy_percentage),
          critical_hits_accuracy_percentage: avg(cl.critical_hits_accuracy_percentage),
          multikill_best: avg(cl.multikill_best),
          turrets_destroyed: avg(cl.turrets_destroyed),
          defensive_assists: avg(cl.defensive_assists),
          offensive_assists: avg(cl.offensive_assists)
        }
      ),

      game_history_statistic: ^from(gh in GameHistory,
        group_by: gh.id,
        select: %{
          id: gh.id,
          games_played: avg(gh.games_played),
          games_won: avg(gh.games_won),
          games_lost: avg(gh.games_lost),
          games_tied: avg(gh.games_tied),
          time_played: avg(gh.time_played),
          time_spent_on_fire: avg(gh.time_spent_on_fire),
          win_percentage: avg(gh.win_percentage)
        }
      ),


      match_awards_statistic: ^from(ma in MatchAward,
        group_by: ma.id,
        select: %{
          id: ma.id,
          bronze_medals: avg(ma.bronze_medals),
          silver_medals: avg(ma.silver_medals),
          gold_medals: avg(ma.gold_medals),
          total_medals: avg(ma.total_medals),
          cards: avg(ma.cards)
        }
      )
    ])
  end

  defp statistics_table_query do
    [
      combat_average_statistic: from(ca in CombatAverage,
        group_by: ca.id,
        select: %{
          id: ca.id,
          critical_hits_average: avg(ca.critical_hits_average),
          damage_done_average: avg(ca.damage_done_average),
          deaths_average: avg(ca.deaths_average),
          defensive_assists_average: avg(ca.defensive_assists_average),
          eliminations_average: avg(ca.eliminations_average),
          final_blows_average: avg(ca.final_blows_average),
          healing_done_average: avg(ca.healing_done_average),
          melee_final_blows_average: avg(ca.melee_final_blows_average),
          objective_kills_average: avg(ca.objective_kills_average),
          objective_time_average: avg(ca.objective_time_average),
          offensive_assists_average: avg(ca.offensive_assists_average),
          self_healing_average: avg(ca.self_healing_average),
          solo_kills_average: avg(ca.solo_kills_average),
          time_spent_on_fire_average: avg(ca.time_spent_on_fire_average),
          damage_blocked_average: avg(ca.damage_blocked_average),
          melee_kills_average: avg(ca.melee_kills_average)
        }
      ),

      combat_best_statistic: from(cb in CombatBest,
        group_by: cb.id,
        select: %{
          id: cb.id,
          eliminations_most_in_life: avg(cb.eliminations_most_in_life),
          eliminations_most_in_game: avg(cb.eliminations_most_in_game),
          critical_hits_most_in_game: avg(cb.critical_hits_most_in_game),
          critical_hits_most_in_life: avg(cb.critical_hits_most_in_life),
          damage_done_most_in_game: avg(cb.damage_done_most_in_game),
          damage_done_most_in_life: avg(cb.damage_done_most_in_life),
          melee_final_blows_most_in_game: avg(cb.melee_final_blows_most_in_game),
          weapon_accuracy_best_in_game_percentage: avg(cb.weapon_accuracy_best_in_game_percentage),
          kill_streak_best: avg(cb.kill_streak_best),
          environmental_kills_most_in_game: avg(cb.environmental_kills_most_in_game),
          defensive_assists_most_in_game: avg(cb.defensive_assists_most_in_game),
          offensive_assists_most_in_game: avg(cb.offensive_assists_most_in_game),
          final_blows_most_in_game: avg(cb.final_blows_most_in_game),
          solo_kills_most_in_game: avg(cb.solo_kills_most_in_game),
          objective_kills_most_in_game: avg(cb.objective_kills_most_in_game),
          objective_time_most_in_game: avg(cb.objective_time_most_in_game),
          turrets_destroyed_most_in_game: avg(cb.turrets_destroyed_most_in_game),
          time_spent_on_fire_most_in_game: avg(cb.time_spent_on_fire_most_in_game),
          healing_done_most_in_game: avg(cb.healing_done_most_in_game),
          healing_done_most_in_life: avg(cb.healing_done_most_in_life),
          self_healing_most_in_game: avg(cb.self_healing_most_in_game),
          multikill_best: avg(cb.multikill_best),
          recon_assists_most_in_game: avg(cb.recon_assists_most_in_game),
          damage_blocked_most_in_game: avg(cb.damage_blocked_most_in_game),
          melee_kills_most_in_game: avg(cb.melee_kills_most_in_game)
        }
      ),

      combat_lifetime_statistic: from(cl in CombatLifetime,
        group_by: cl.id,
        select: %{
          id: cl.id,
          solo_kills: avg(cl.solo_kills),
          eliminations: avg(cl.eliminations),
          eliminations_per_life: avg(cl.eliminations_per_life),
          time_spent_on_fire: avg(cl.time_spent_on_fire),
          deaths: avg(cl.deaths),
          objective_kills: avg(cl.objective_kills),
          objective_time: avg(cl.objective_time),
          environmental_kills: avg(cl.environmental_kills),
          environmental_deaths: avg(cl.environmental_deaths),
          damage_done: avg(cl.damage_done),
          shots_fired: avg(cl.shots_fired),
          shots_hit: avg(cl.shots_hit),
          critical_hits: avg(cl.critical_hits),
          healing_done: avg(cl.healing_done),
          final_blows: avg(cl.final_blows),
          melee_final_blows: avg(cl.melee_final_blows),
          multikills: avg(cl.multikills),
          recon_assists: avg(cl.recon_assists),
          teleporter_pads_destroyed: avg(cl.teleporter_pads_destroyed),
          damage_blocked: avg(cl.damage_blocked),
          melee_kills: avg(cl.melee_kills),
          weapon_accuracy_percentage: avg(cl.weapon_accuracy_percentage),
          critical_hits_accuracy_percentage: avg(cl.critical_hits_accuracy_percentage),
          multikill_best: avg(cl.multikill_best),
          turrets_destroyed: avg(cl.turrets_destroyed),
          defensive_assists: avg(cl.defensive_assists),
          offensive_assists: avg(cl.offensive_assists)
        }
      ),

      game_history_statistic: from(gh in GameHistory,
        group_by: gh.id,
        select: %{
          id: gh.id,
          games_played: avg(gh.games_played),
          games_won: avg(gh.games_won),
          games_lost: avg(gh.games_lost),
          games_tied: avg(gh.games_tied),
          time_played: avg(gh.time_played),
          time_spent_on_fire: avg(gh.time_spent_on_fire),
          win_percentage: avg(gh.win_percentage)
        }
      ),


      match_awards_statistic: from(ma in MatchAward,
        group_by: ma.id,
        select: %{
          id: ma.id,
          bronze_medals: avg(ma.bronze_medals),
          silver_medals: avg(ma.silver_medals),
          gold_medals: avg(ma.gold_medals),
          total_medals: avg(ma.total_medals),
          cards: avg(ma.cards)
        }
      )
    ]
  end
end
