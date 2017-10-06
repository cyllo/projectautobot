defmodule Api.Schema.Queries.StatisticAveragesSnapshotQueries do
  use Absinthe.Schema.Notation

  alias Api.AverageStatisticsSnapshotResolver

  object :statistic_averages_snapshot_queries do
    field :statistics_averages_snapshot, :statistics_averages_snapshot do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime

      resolve &AverageStatisticsSnapshotResolver.find/2
    end

    field :statistics_averages_snapshots, list_of(:statistics_averages_snapshot) do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime

      resolve &AverageStatisticsSnapshotResolver.all/2
    end
  end
end
