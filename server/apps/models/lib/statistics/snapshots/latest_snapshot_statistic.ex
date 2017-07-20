defmodule Models.Statistics.Snapshots.LatestSnapshotStatistic do
  use Models.Model
  alias Models.Repo
  alias Models.Statistics.Snapshots.{LatestSnapshotStatistic, HeroStatistic, AllHeroesStatistic}
  alias Models.Statistics.{HeroSpecific, CombatAverage, CombatBest, CombatLifetime, GameHistory, MatchAward}
  alias Models.Game.Hero

  schema "latest_snapshot_statistics" do
    field :is_competitive, :boolean
    belongs_to :gamer_tag, Models.Game.GamerTag
    has_many :hero_snapshot_statistics, Models.Statistics.Snapshots.HeroStatistic, foreign_key: :snapshot_statistic_id
    has_one :all_heroes_snapshot_statistics, Models.Statistics.Snapshots.AllHeroesStatistic, foreign_key: :snapshot_statistic_id

    timestamps(type: :utc_datetime)
  end

  def average(opts \\ [is_competitive: true]) do
    is_competitive = Keyword.get(opts, :is_competitive)

    from(lss in LatestSnapshotStatistic,
      where: lss.is_competitive == ^is_competitive,

      # All Heroes Statistic
      inner_join: ahs in AllHeroesStatistic,
      on: lss.id == ahs.snapshot_statistic_id,
      inner_join: amas in MatchAward,
      on: amas.id == ahs.match_awards_statistic_id,
      inner_join: aghs in GameHistory,
      on: aghs.id == ahs.game_history_statistic_id,
      inner_join: acas in CombatAverage,
      on: acas.id == ahs.combat_average_statistic_id,
      inner_join: acls in CombatLifetime,
      on: acls.id == ahs.combat_lifetime_statistic_id,
      inner_join: acbs in CombatBest,
      on: acbs.id == ahs.combat_best_statistic_id,

      # Heroes Statistic
      inner_join: hs in HeroStatistic,
      on: lss.id == hs.snapshot_statistic_id,
      inner_join: h in Hero,
      on: h.id == hs.hero_id,
      inner_join: hmas in MatchAward,
      on: hmas.id == hs.match_awards_statistic_id,
      inner_join: hghs in GameHistory,
      on: hghs.id == hs.game_history_statistic_id,
      inner_join: hcas in CombatAverage,
      on: hcas.id == hs.combat_average_statistic_id,
      inner_join: hcls in CombatLifetime,
      on: hcls.id == hs.combat_lifetime_statistic_id,
      inner_join: hcbs in CombatBest,
      on: hcbs.id == hs.combat_best_statistic_id,

      select: %{
        hero_snapshot_statistics: [%{
          # hero_id: hs.hero_id,

          match_awards_statistic: %{
            bronze_medals: avg(hmas.bronze_medals),
            silver_medals: avg(hmas.silver_medals),
            gold_medals: avg(hmas.gold_medals),
            total_medals: avg(hmas.total_medals),
            cards: avg(hmas.cards)
          },

          game_history_statistic: %{
            games_played: avg(hghs.games_played),
            games_won: avg(hghs.games_won),
            games_lost: avg(hghs.games_lost),
            games_tied: avg(hghs.games_tied),
            time_played: avg(hghs.time_played),
            time_spent_on_fire: avg(hghs.time_spent_on_fire),
            win_percentage: avg(hghs.win_percentage)
          },

          combat_average_statistic: %{
            critical_hits_average: avg(hcas.critical_hits_average),
            damage_done_average: avg(hcas.damage_done_average),
            deaths_average: avg(hcas.deaths_average),
            defensive_assists_average: avg(hcas.defensive_assists_average),
            eliminations_average: avg(hcas.eliminations_average),
            final_blows_average: avg(hcas.final_blows_average),
            healing_done_average: avg(hcas.healing_done_average),
            melee_final_blows_average: avg(hcas.melee_final_blows_average),
            objective_kills_average: avg(hcas.objective_kills_average),
            objective_time_average: avg(hcas.objective_time_average),
            offensive_assists_average: avg(hcas.offensive_assists_average),
            self_healing_average: avg(hcas.self_healing_average),
            solo_kills_average: avg(hcas.solo_kills_average),
            time_spent_on_fire_average: avg(hcas.time_spent_on_fire_average),
            damage_blocked_average: avg(hcas.damage_blocked_average),
            melee_kills_average: avg(hcas.melee_kills_average)
          },

          combat_lifetime_statistic: %{
            solo_kills: avg(hcls.solo_kills),
            eliminations: avg(hcls.eliminations),
            eliminations_per_life: avg(hcls.eliminations_per_life),
            time_spent_on_fire: avg(hcls.time_spent_on_fire),
            deaths: avg(hcls.deaths),
            objective_kills: avg(hcls.objective_kills),
            objective_time: avg(hcls.objective_time),
            environmental_kills: avg(hcls.environmental_kills),
            environmental_deaths: avg(hcls.environmental_deaths),
            damage_done: avg(hcls.damage_done),
            shots_fired: avg(hcls.shots_fired),
            shots_hit: avg(hcls.shots_hit),
            critical_hits: avg(hcls.critical_hits),
            healing_done: avg(hcls.healing_done),
            final_blows: avg(hcls.final_blows),
            melee_final_blows: avg(hcls.melee_final_blows),
            multikills: avg(hcls.multikills),
            recon_assists: avg(hcls.recon_assists),
            teleporter_pads_destroyed: avg(hcls.teleporter_pads_destroyed),
            damage_blocked: avg(hcls.damage_blocked),
            melee_kills: avg(hcls.melee_kills),
            weapon_accuracy_percentage: avg(hcls.weapon_accuracy_percentage),
            critical_hits_accuracy_percentage: avg(hcls.critical_hits_accuracy_percentage),
            multikill_best: avg(hcls.multikill_best),
            turrets_destroyed: avg(hcls.turrets_destroyed),
            defensive_assists: avg(hcls.defensive_assists),
            offensive_assists: avg(hcls.offensive_assists)
          },

          combat_best_statistic: %{
            eliminations_most_in_life: avg(hcbs.eliminations_most_in_life),
            eliminations_most_in_game: avg(hcbs.eliminations_most_in_game),
            critical_hits_most_in_game: avg(hcbs.critical_hits_most_in_game),
            critical_hits_most_in_life: avg(hcbs.critical_hits_most_in_life),
            damage_done_most_in_game: avg(hcbs.damage_done_most_in_game),
            damage_done_most_in_life: avg(hcbs.damage_done_most_in_life),
            melee_final_blows_most_in_game: avg(hcbs.melee_final_blows_most_in_game),
            weapon_accuracy_best_in_game_percentage: avg(hcbs.weapon_accuracy_best_in_game_percentage),
            kill_streak_best: avg(hcbs.kill_streak_best),
            environmental_kills_most_in_game: avg(hcbs.environmental_kills_most_in_game),
            defensive_assists_most_in_game: avg(hcbs.defensive_assists_most_in_game),
            offensive_assists_most_in_game: avg(hcbs.offensive_assists_most_in_game),
            final_blows_most_in_game: avg(hcbs.final_blows_most_in_game),
            solo_kills_most_in_game: avg(hcbs.solo_kills_most_in_game),
            objective_kills_most_in_game: avg(hcbs.objective_kills_most_in_game),
            objective_time_most_in_game: avg(hcbs.objective_time_most_in_game),
            turrets_destroyed_most_in_game: avg(hcbs.turrets_destroyed_most_in_game),
            time_spent_on_fire_most_in_game: avg(hcbs.time_spent_on_fire_most_in_game),
            healing_done_most_in_game: avg(hcbs.healing_done_most_in_game),
            healing_done_most_in_life: avg(hcbs.healing_done_most_in_life),
            self_healing_most_in_game: avg(hcbs.self_healing_most_in_game),
            multikill_best: avg(hcbs.multikill_best),
            recon_assists_most_in_game: avg(hcbs.recon_assists_most_in_game),
            damage_blocked_most_in_game: avg(hcbs.damage_blocked_most_in_game),
            melee_kills_most_in_game: avg(hcbs.melee_kills_most_in_game)
          }
        }],

        all_heroes_snapshot_statistic: %{
          match_awards_statistic: %{
            bronze_medals: avg(amas.bronze_medals),
            silver_medals: avg(amas.silver_medals),
            gold_medals: avg(amas.gold_medals),
            total_medals: avg(amas.total_medals),
            cards: avg(amas.cards)
          },

          game_history_statistic: %{
            games_played: avg(aghs.games_played),
            games_won: avg(aghs.games_won),
            games_lost: avg(aghs.games_lost),
            games_tied: avg(aghs.games_tied),
            time_played: avg(aghs.time_played),
            time_spent_on_fire: avg(aghs.time_spent_on_fire),
            win_percentage: avg(aghs.win_percentage)
          },

          combat_average_statistic: %{
            critical_hits_average: avg(acas.critical_hits_average),
            damage_done_average: avg(acas.damage_done_average),
            deaths_average: avg(acas.deaths_average),
            defensive_assists_average: avg(acas.defensive_assists_average),
            eliminations_average: avg(acas.eliminations_average),
            final_blows_average: avg(acas.final_blows_average),
            healing_done_average: avg(acas.healing_done_average),
            melee_final_blows_average: avg(acas.melee_final_blows_average),
            objective_kills_average: avg(acas.objective_kills_average),
            objective_time_average: avg(acas.objective_time_average),
            offensive_assists_average: avg(acas.offensive_assists_average),
            self_healing_average: avg(acas.self_healing_average),
            solo_kills_average: avg(acas.solo_kills_average),
            time_spent_on_fire_average: avg(acas.time_spent_on_fire_average),
            damage_blocked_average: avg(acas.damage_blocked_average),
            melee_kills_average: avg(acas.melee_kills_average)
          },

          combat_lifetime_statistic: %{
            solo_kills: avg(acls.solo_kills),
            eliminations: avg(acls.eliminations),
            eliminations_per_life: avg(acls.eliminations_per_life),
            time_spent_on_fire: avg(acls.time_spent_on_fire),
            deaths: avg(acls.deaths),
            objective_kills: avg(acls.objective_kills),
            objective_time: avg(acls.objective_time),
            environmental_kills: avg(acls.environmental_kills),
            environmental_deaths: avg(acls.environmental_deaths),
            damage_done: avg(acls.damage_done),
            shots_fired: avg(acls.shots_fired),
            shots_hit: avg(acls.shots_hit),
            critical_hits: avg(acls.critical_hits),
            healing_done: avg(acls.healing_done),
            final_blows: avg(acls.final_blows),
            melee_final_blows: avg(acls.melee_final_blows),
            multikills: avg(acls.multikills),
            recon_assists: avg(acls.recon_assists),
            teleporter_pads_destroyed: avg(acls.teleporter_pads_destroyed),
            damage_blocked: avg(acls.damage_blocked),
            melee_kills: avg(acls.melee_kills),
            weapon_accuracy_percentage: avg(acls.weapon_accuracy_percentage),
            critical_hits_accuracy_percentage: avg(acls.critical_hits_accuracy_percentage),
            multikill_best: avg(acls.multikill_best),
            turrets_destroyed: avg(acls.turrets_destroyed),
            defensive_assists: avg(acls.defensive_assists),
            offensive_assists: avg(acls.offensive_assists)
          },

          combat_best_statistic: %{
            eliminations_most_in_life: avg(acbs.eliminations_most_in_life),
            eliminations_most_in_game: avg(acbs.eliminations_most_in_game),
            critical_hits_most_in_game: avg(acbs.critical_hits_most_in_game),
            critical_hits_most_in_life: avg(acbs.critical_hits_most_in_life),
            damage_done_most_in_game: avg(acbs.damage_done_most_in_game),
            damage_done_most_in_life: avg(acbs.damage_done_most_in_life),
            melee_final_blows_most_in_game: avg(acbs.melee_final_blows_most_in_game),
            weapon_accuracy_best_in_game_percentage: avg(acbs.weapon_accuracy_best_in_game_percentage),
            kill_streak_best: avg(acbs.kill_streak_best),
            environmental_kills_most_in_game: avg(acbs.environmental_kills_most_in_game),
            defensive_assists_most_in_game: avg(acbs.defensive_assists_most_in_game),
            offensive_assists_most_in_game: avg(acbs.offensive_assists_most_in_game),
            final_blows_most_in_game: avg(acbs.final_blows_most_in_game),
            solo_kills_most_in_game: avg(acbs.solo_kills_most_in_game),
            objective_kills_most_in_game: avg(acbs.objective_kills_most_in_game),
            objective_time_most_in_game: avg(acbs.objective_time_most_in_game),
            turrets_destroyed_most_in_game: avg(acbs.turrets_destroyed_most_in_game),
            time_spent_on_fire_most_in_game: avg(acbs.time_spent_on_fire_most_in_game),
            healing_done_most_in_game: avg(acbs.healing_done_most_in_game),
            healing_done_most_in_life: avg(acbs.healing_done_most_in_life),
            self_healing_most_in_game: avg(acbs.self_healing_most_in_game),
            multikill_best: avg(acbs.multikill_best),
            recon_assists_most_in_game: avg(acbs.recon_assists_most_in_game),
            damage_blocked_most_in_game: avg(acbs.damage_blocked_most_in_game),
            melee_kills_most_in_game: avg(acbs.melee_kills_most_in_game)
          }
        }
      }
    ) |> Repo.one
  end

  def hero_average(hero_id, opts \\ [is_competitive: true])
  def hero_average(hero_id, opts) do
    is_competitive = Keyword.get(opts, :is_competitive, false)

    from(lss in LatestSnapshotStatistic,
      where: [is_competitive: ^is_competitive],

      inner_join: hs in HeroStatistic,
      on: lss.id == hs.snapshot_statistic_id,
      where: hs.hero_id == ^hero_id,
      inner_join: hmas in MatchAward,
      on: hmas.id == hs.match_awards_statistic_id,
      inner_join: hghs in GameHistory,
      on: hghs.id == hs.game_history_statistic_id,
      inner_join: hcas in CombatAverage,
      on: hcas.id == hs.combat_average_statistic_id,
      inner_join: hcls in CombatLifetime,
      on: hcls.id == hs.combat_lifetime_statistic_id,
      inner_join: hcbs in CombatBest,
      on: hcbs.id == hs.combat_best_statistic_id,

      select: %{
        match_awards_statistic: %{
          bronze_medals: avg(hmas.bronze_medals),
          silver_medals: avg(hmas.silver_medals),
          gold_medals: avg(hmas.gold_medals),
          total_medals: avg(hmas.total_medals),
          cards: avg(hmas.cards)
        },

        game_history_statistic: %{
          games_played: avg(hghs.games_played),
          games_won: avg(hghs.games_won),
          games_lost: avg(hghs.games_lost),
          games_tied: avg(hghs.games_tied),
          time_played: avg(hghs.time_played),
          time_spent_on_fire: avg(hghs.time_spent_on_fire),
          win_percentage: avg(hghs.win_percentage)
        },

        combat_average_statistic: %{
          critical_hits_average: avg(hcas.critical_hits_average),
          damage_done_average: avg(hcas.damage_done_average),
          deaths_average: avg(hcas.deaths_average),
          defensive_assists_average: avg(hcas.defensive_assists_average),
          eliminations_average: avg(hcas.eliminations_average),
          final_blows_average: avg(hcas.final_blows_average),
          healing_done_average: avg(hcas.healing_done_average),
          melee_final_blows_average: avg(hcas.melee_final_blows_average),
          objective_kills_average: avg(hcas.objective_kills_average),
          objective_time_average: avg(hcas.objective_time_average),
          offensive_assists_average: avg(hcas.offensive_assists_average),
          self_healing_average: avg(hcas.self_healing_average),
          solo_kills_average: avg(hcas.solo_kills_average),
          time_spent_on_fire_average: avg(hcas.time_spent_on_fire_average),
          damage_blocked_average: avg(hcas.damage_blocked_average),
          melee_kills_average: avg(hcas.melee_kills_average)
        },

        combat_lifetime_statistic: %{
          solo_kills: avg(hcls.solo_kills),
          eliminations: avg(hcls.eliminations),
          eliminations_per_life: avg(hcls.eliminations_per_life),
          time_spent_on_fire: avg(hcls.time_spent_on_fire),
          deaths: avg(hcls.deaths),
          objective_kills: avg(hcls.objective_kills),
          objective_time: avg(hcls.objective_time),
          environmental_kills: avg(hcls.environmental_kills),
          environmental_deaths: avg(hcls.environmental_deaths),
          damage_done: avg(hcls.damage_done),
          shots_fired: avg(hcls.shots_fired),
          shots_hit: avg(hcls.shots_hit),
          critical_hits: avg(hcls.critical_hits),
          healing_done: avg(hcls.healing_done),
          final_blows: avg(hcls.final_blows),
          melee_final_blows: avg(hcls.melee_final_blows),
          multikills: avg(hcls.multikills),
          recon_assists: avg(hcls.recon_assists),
          teleporter_pads_destroyed: avg(hcls.teleporter_pads_destroyed),
          damage_blocked: avg(hcls.damage_blocked),
          melee_kills: avg(hcls.melee_kills),
          weapon_accuracy_percentage: avg(hcls.weapon_accuracy_percentage),
          critical_hits_accuracy_percentage: avg(hcls.critical_hits_accuracy_percentage),
          multikill_best: avg(hcls.multikill_best),
          turrets_destroyed: avg(hcls.turrets_destroyed),
          defensive_assists: avg(hcls.defensive_assists),
          offensive_assists: avg(hcls.offensive_assists)
        },

        combat_best_statistic: %{
          eliminations_most_in_life: avg(hcbs.eliminations_most_in_life),
          eliminations_most_in_game: avg(hcbs.eliminations_most_in_game),
          critical_hits_most_in_game: avg(hcbs.critical_hits_most_in_game),
          critical_hits_most_in_life: avg(hcbs.critical_hits_most_in_life),
          damage_done_most_in_game: avg(hcbs.damage_done_most_in_game),
          damage_done_most_in_life: avg(hcbs.damage_done_most_in_life),
          melee_final_blows_most_in_game: avg(hcbs.melee_final_blows_most_in_game),
          weapon_accuracy_best_in_game_percentage: avg(hcbs.weapon_accuracy_best_in_game_percentage),
          kill_streak_best: avg(hcbs.kill_streak_best),
          environmental_kills_most_in_game: avg(hcbs.environmental_kills_most_in_game),
          defensive_assists_most_in_game: avg(hcbs.defensive_assists_most_in_game),
          offensive_assists_most_in_game: avg(hcbs.offensive_assists_most_in_game),
          final_blows_most_in_game: avg(hcbs.final_blows_most_in_game),
          solo_kills_most_in_game: avg(hcbs.solo_kills_most_in_game),
          objective_kills_most_in_game: avg(hcbs.objective_kills_most_in_game),
          objective_time_most_in_game: avg(hcbs.objective_time_most_in_game),
          turrets_destroyed_most_in_game: avg(hcbs.turrets_destroyed_most_in_game),
          time_spent_on_fire_most_in_game: avg(hcbs.time_spent_on_fire_most_in_game),
          healing_done_most_in_game: avg(hcbs.healing_done_most_in_game),
          healing_done_most_in_life: avg(hcbs.healing_done_most_in_life),
          self_healing_most_in_game: avg(hcbs.self_healing_most_in_game),
          multikill_best: avg(hcbs.multikill_best),
          recon_assists_most_in_game: avg(hcbs.recon_assists_most_in_game),
          damage_blocked_most_in_game: avg(hcbs.damage_blocked_most_in_game),
          melee_kills_most_in_game: avg(hcbs.melee_kills_most_in_game)
        }
      },
    ) |> Repo.one
  end
end
