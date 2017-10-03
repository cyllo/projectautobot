defmodule Api.Schema.SnapshotTypes do
  use Absinthe.Schema.Notation
  alias Api.SnapshotStatisticResolver

  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]

  enum :snapshot_statistic_type do
    value :competitive
    value :quickplay
  end

  enum :hero_snapshot_statistic_type do
    value :hero_total_competitive
    value :hero_total_quickplay
    value :hero_competitive
    value :hero_quickplay
  end

  input_object :rank_by_input do
    field :platform, :string
    field :region, :string
  end

  @desc "Snapshot that marks gathering of all the combat and other statistics"
  object :snapshot_statistic do
    field :id, :integer
    field :gamer_tag_id, :integer

    field :heroes_total_snapshot_statistic, :heroes_total_snapshot_statistic do
      arg :type, non_null(:snapshot_statistic_type)

      resolve fn snapshot_statistic, args, _ ->
        batch(
          {SnapshotStatisticResolver, :get_heroes_totals_by_snapshot_ids, args},
          snapshot_statistic.id,
          &{:ok, Map.get(&1, snapshot_statistic.id)}
        )
      end
    end

    field :hero_snapshot_statistics, list_of(:hero_snapshot_statistic) do
      arg :type, non_null(:snapshot_statistic_type)

      resolve fn snapshot_statistic, arg, _ ->
        batch(
          {SnapshotStatisticResolver, :get_hero_statistics_by_snapshot_ids, arg},
          snapshot_statistic.id,
          &{:ok, Map.get(&1, snapshot_statistic.id)}
        )
      end
    end

    field :profile_snapshot_statistic, :profile_snapshot_statistic do
      resolve fn snapshot_statistic, _, _ ->
        batch(
          {SnapshotStatisticResolver, :get_snapshots_profile_snapshots},
          snapshot_statistic,
          &{:ok, Map.get(&1, snapshot_statistic.id)}
        )
      end
    end

    timestamp_types
  end

  object :profile_snapshot_statistic do
    field :id, :integer

    field :snapshot_statistic_id, :integer
    field :profile_statistic_id, :integer
    field :leaderboard_snapshot_statistic_id, :integer
    field :statistics_averages_snapshot_id, :integer

    field :statistics_averages_snapshot, :statistics_averages_snapshot do
      resolve fn profile_snapshot, _, _ ->
        batch(
          {Api.AverageStatisticsSnapshotResolver, :get_profile_snapshots_averages_snapshots},
          profile_snapshot,
          &{:ok, Map.get(&1, profile_snapshot.id)}
        )
      end
    end

    field :leaderboard_snapshot_statistic, :leaderboard_snapshot_statistic do
      resolve fn profile_snapshot, _, _ ->
        batch(
          {SnapshotStatisticResolver, :get_profile_snapshots_leaderboard_snapshots},
          profile_snapshot,
          &{:ok, Map.get(&1, profile_snapshot.id)}
        )
      end
    end

    field :profile_statistic, :profile_statistic do
      resolve fn profile_snapshot, _, _ ->
        batch(
          {SnapshotStatisticResolver, :get_profile_snapshots_profile_stats},
          profile_snapshot,
          &{:ok, Map.get(&1, profile_snapshot.id)}
        )
      end
    end
  end

  object :heroes_total_snapshot_statistic do
    field :id, :integer
    field :snapshot_statistic_id, :integer
    field :combat_best_statistic_id, :integer
    field :game_average_statistic_id, :integer
    field :combat_lifetime_statistic_id, :integer
    field :match_awards_statistic_id, :integer
    field :game_history_statistic_id, :integer
    field :statistic_type, :hero_snapshot_statistic_type

    field :combat_best_statistic, :combat_best_statistic do
      resolve &batch_get_combat_bests/3
    end

    field :game_average_statistic, :game_average_statistic do
      resolve &batch_get_game_averages/3
    end

    field :combat_lifetime_statistic, :combat_lifetime_statistic do
      resolve &batch_get_combat_lifetimes/3
    end

    field :match_awards_statistic, :match_awards_statistic do
      resolve &batch_get_match_awards/3
    end

    field :game_history_statistic, :game_history_statistic do
      resolve &batch_get_game_histories/3
    end
  end

  object :hero_snapshot_statistic do
    field :id, :integer
    field :hero_id, :integer
    field :snapshot_statistic_id, :integer
    field :combat_best_statistic_id, :integer
    field :game_average_statistic_id, :integer
    field :combat_lifetime_statistic_id, :integer
    field :hero_specific_statistic_id, :integer
    field :match_awards_statistic_id, :integer
    field :game_history_statistic_id, :integer
    field :statistic_type, :hero_snapshot_statistic_type

    field :combat_best_statistic, :combat_best_statistic do
      resolve &batch_get_combat_bests/3
    end

    field :game_average_statistic, :game_average_statistic do
      resolve &batch_get_game_averages/3
    end

    field :combat_lifetime_statistic, :combat_lifetime_statistic do
      resolve &batch_get_combat_lifetimes/3
    end

    field :hero_specific_statistic, :hero_specific_statistic do
      resolve &batch_get_hero_specifics/3
    end

    field :match_awards_statistic, :match_awards_statistic do
      resolve &batch_get_match_awards/3
    end

    field :game_history_statistic, :game_history_statistic do
      resolve &batch_get_game_histories/3
    end

    field :hero, :hero do
      resolve fn hero_snapshot_statistic, _, _ ->
        batch(
          {SnapshotStatisticResolver, :get_heroes_by_ids},
          hero_snapshot_statistic.hero_id,
          &{:ok, Map.get(&1, hero_snapshot_statistic.hero_id)}
        )
      end
    end
  end

  defp batch_get_combat_bests(snapshot_statistic, _, _) do
    batch_get(:get_combat_best_statistics, :combat_best_statistic_id, snapshot_statistic)
  end

  defp batch_get_game_averages(snapshot_statistic, _, _) do
    batch_get(:get_game_average_statistics, :game_average_statistic_id, snapshot_statistic)
  end

  defp batch_get_combat_lifetimes(snapshot_statistic, _, _) do
    batch_get(:get_combat_lifetime_statistics, :combat_lifetime_statistic_id, snapshot_statistic)
  end

  defp batch_get_hero_specifics(snapshot_statistic, _, _) do
    batch_get(:get_hero_specific_statistics, :hero_specific_statistic_id, snapshot_statistic)
  end

  defp batch_get_match_awards(snapshot_statistic, _, _) do
    batch_get(:get_match_award_statistics, :match_awards_statistic_id, snapshot_statistic)
  end

  defp batch_get_game_histories(snapshot_statistic, _, _) do
    batch_get(:get_game_history_statistics, :game_history_statistic_id, snapshot_statistic)
  end

  defp batch_get(fn_atom, snapshot_id_prop, snapshot_statistic) do
    batch(
      {SnapshotStatisticResolver, fn_atom},
      Map.get(snapshot_statistic, snapshot_id_prop),
      &{:ok, Map.get(&1, Map.get(snapshot_statistic, snapshot_id_prop))}
    )
  end
end
