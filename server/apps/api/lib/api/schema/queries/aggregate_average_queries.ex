defmodule Api.Schema.Queries.AggregateAverageQueries do
  use Absinthe.Schema.Notation

  alias Api.{SnapshotStatisticsAverageResolver, HeroStatisticsAverageResolver}

  object :aggregate_average_queries do
    field :hero_statistics_aggregate_average, :hero_statistics_aggregate_average do
      arg :hero_id, non_null(:integer)
      arg :type, non_null(:snapshot_statistic_type)
      arg :region, :string
      arg :platform, :string

      resolve &HeroStatisticsAverageResolver.find_hero_and_average/2
    end

    field :snapshots_statistics_aggregate_average, :snapshot_statistics_aggregate_average do
      arg :type, non_null(:snapshot_statistic_type)

      resolve &SnapshotStatisticsAverageResolver.average/2
    end
  end
end
