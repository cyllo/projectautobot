defmodule Api.Schema.SnapshotTypes do
  use Absinthe.Schema.Notation
  alias Api.SnapshotStatisticResolver

  @desc "Snapshot that marks gathering of all the combat and other statistics"
  object :snapshot_statistic do
    field :id, :integer
    field :gamer_tag_id, :integer

    field :is_competitive, :boolean

    field :all_heroes_snapshot_statistic, :all_heroes_snapshot_statistic do
      resolve fn snapshot_statistic, _, _ ->
        batch(
          {SnapshotStatisticResolver, :get_all_heroes_statistics_by_snapshot_ids},
          snapshot_statistic.id,
          &{:ok, Map.get(&1, snapshot_statistic.id)}
        )
      end
    end

    field :hero_snapshot_statistics, list_of(:hero_snapshot_statistic) do
      resolve fn snapshot_statistic, _, _ ->
        batch(
          {SnapshotStatisticResolver, :get_hero_statistics_by_snapshot_ids},
          snapshot_statistic.id,
          &{:ok, Map.get(&1, snapshot_statistic.id)}
        )
      end
    end
  end

  object :all_heroes_snapshot_statistic do
    field :id, :integer
    field :snapshot_statistic_id, :integer
    field :combat_best_statistic_id, :integer
    field :combat_average_statistic_id, :integer
    field :combat_lifetime_statistic_id, :integer
    field :match_awards_statistic_id, :integer
    field :game_history_statistic_id, :integer

    field :combat_best_statistic, :combat_best_statistic do
      resolve &batch_get_combat_bests/3
    end

    field :combat_average_statistic, :combat_average_statistic do
      resolve &batch_get_combat_averages/3
    end

    field :combat_lifetime_statistic, :combat_lifetime_statistic do
      resolve &batch_get_combat_lifetimes/3
    end

    field :hero_specific, :hero_specific do
      resolve &batch_get_hero_specifics/3
    end

    field :match_award, :match_award do
      resolve &batch_get_match_awards/3
    end

    field :game_history, :game_history do
      resolve &batch_get_game_histories/3
    end
  end

  object :hero_snapshot_statistic do
    field :id, :integer
    field :hero_id, :integer
    field :snapshot_statistic_id, :integer
    field :combat_best_statistic_id, :integer
    field :combat_average_statistic_id, :integer
    field :combat_lifetime_statistic_id, :integer
    field :hero_specific_statistic_id, :integer
    field :match_awards_statistic_id, :integer
    field :game_history_statistic_id, :integer

    field :combat_best_statistic, :combat_best_statistic do
      resolve &batch_get_combat_bests/3
    end

    field :combat_average_statistic, :combat_average_statistic do
      resolve &batch_get_combat_averages/3
    end

    field :combat_lifetime_statistic, :combat_lifetime_statistic do
      resolve &batch_get_combat_lifetimes/3
    end

    field :hero_specific, :hero_specific do
      resolve &batch_get_hero_specifics/3
    end

    field :match_award, :match_award do
      resolve &batch_get_match_awards/3
    end

    field :game_history, :game_history do
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

  defp batch_get_combat_averages(snapshot_statistic, _, _) do
    batch_get(:get_combat_average_statistics, :combat_average_statistic_id, snapshot_statistic)
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