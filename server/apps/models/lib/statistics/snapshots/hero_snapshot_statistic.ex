defmodule Models.Statistics.Snapshots.HeroSnapshotStatistic do
  use Models.Model
  alias Models.Statistics.Snapshots.{HeroSnapshotStatistic, SnapshotStatistic}
  alias Models.Statistics.{
    HeroSpecific, CombatAverage, CombatBest,
    CombatLifetime, GameHistory, MatchAward
  }

  schema "hero_snapshot_statistics" do
    field :statistic_type, HeroStatisticTypeEnum
    belongs_to :hero, Models.Game.Hero
    belongs_to :snapshot_statistic, Models.Statistics.Snapshots.SnapshotStatistic
    belongs_to :combat_average_statistic, Models.Statistics.CombatAverage
    belongs_to :combat_best_statistic, Models.Statistics.CombatBest
    belongs_to :combat_lifetime_statistic, Models.Statistics.CombatLifetime
    belongs_to :game_history_statistic, Models.Statistics.GameHistory
    belongs_to :hero_specific_statistic, Models.Statistics.HeroSpecific
    belongs_to :match_awards_statistic, Models.Statistics.MatchAward
  end

  @required_fields [
    :game_history_statistic_id,
    :snapshot_statistic_id,
    :statistic_type
  ]

  @available_fields Enum.concat(@required_fields, [
    :combat_average_statistic_id,
    :combat_best_statistic_id,
    :combat_lifetime_statistic_id,
    :hero_specific_statistic_id,
    :match_awards_statistic_id,
    :hero_id
  ])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%HeroSnapshotStatistic{} = struct, params \\ %{}) do
    struct
      |> cast(params, @available_fields)
      |> validate_required(@required_fields)
      |> validate_inclusion(:statistic_type, Models.Enums.hero_snapshot_types())
  end

  def create_changeset(params), do: changeset(%HeroSnapshotStatistic{}, params)
  def create_changeset(params, type), do: params |> Map.put(:statistic_type, type) |> create_changeset

  @spec heroes_total_query(query :: Ecto.Query, type :: :competitive|:quickplay) :: Ecto.Query
  def heroes_total_query(query, type \\ :competitive) do
    where(query, statistic_type: ^Utility.join_atoms(:hero_total, type))
  end

  @spec heroes_query(query :: Ecto.Query, type :: :competitive|:quickplay) :: Ecto.Query
  def heroes_query(query, type \\ :competitive) do
    where(query, statistic_type: ^Utility.join_atoms(:hero, type))
  end

  def take_snapshot_params(params) when is_list(params), do: Enum.map(params, &take_snapshot_params/1)
  def take_snapshot_params(params) do
    Map.take(params, [:hero, :statistic_type, :hero_id,
                      :snapshot_statistic_id, :combat_average_statistic_id,
                      :combat_best_statistic_id, :combat_lifetime_statistic_id,
                      :game_history_statistic_id, :hero_specific_statistic_id,
                      :match_awards_statistic_id])
  end

  def average_stats_by_stats_type_query(statistic_type) do
    average_stats_query()
      |> stats_type_query(statistic_type)
  end

  def stats_type_query(query, types) when is_list(types), do: where(query, [_, hs], hs.statistic_type in ^types)
  def stats_type_query(query, type), do: where(query, [_, hs], hs.statistic_type == ^type)

  def where_hero_query(query, hero_id), do: where(query, [_, hs], hs.hero_id == ^hero_id)

  def average_stats_query do
    from(ss in subquery(SnapshotStatistic.latest_stats_query),
      inner_join: hs in HeroSnapshotStatistic,
      on: ss.id == hs.snapshot_statistic_id,
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
        }]
      }
    )
  end
end
