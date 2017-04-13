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
        batch({SnapshotStatisticResolver, :get_all_heroes_statistic}, snapshot_statistic.id, fn all_heroes_stats ->
          all_heroes_stats
        end)
      end
    end

    field :hero_snapshot_statistics, list_of(:hero_snapshot_statistic) do
      resolve fn snapshot_statistic, _, _ ->
        batch(
          {SnapshotStatisticResolver, :get_hero_statistics_by_snapshot_ids},
          snapshot_statistic.id,
          fn (a) ->
            {:ok, Map.get(a, snapshot_statistic.id)}
          end
        )
      end
    end
  end

  object :all_heroes_snapshot_statistic do
    field :id, :integer
  end

  object :hero_snapshot_statistic do
    field :id, :integer
    field :hero_id, :integer

    field :hero, :hero do
      resolve fn hero_snapshot_statistic, _, _ ->
        batch(
          {SnapshotStatisticResolver, :get_hero},
          hero_snapshot_statistic.hero_id,
          &{:ok, Map.get(&1, hero_snapshot_statistic.hero_id)}
        )
      end
    end
  end
end
