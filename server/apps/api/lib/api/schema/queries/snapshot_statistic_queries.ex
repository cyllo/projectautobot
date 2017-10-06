defmodule Api.Schema.Queries.SnapshotStatisticQueries do
  use Absinthe.Schema.Notation

  alias Api.SnapshotStatisticResolver

  object :snapshot_statistic_queries do
    field :snapshot_statistic, :snapshot_statistic do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime
      arg :id, :integer

      resolve &SnapshotStatisticResolver.find/2
    end

    field :snapshot_statistics, list_of(:snapshot_statistic) do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime
      arg :ids, list_of(non_null(:integer))
      arg :competitive_bracket_name, :string

      resolve &SnapshotStatisticResolver.all/2
    end

    @desc "Diffs a snapshot statistic pair, diff returns difference from a -> b"
    field :snapshot_statistic_difference, :snapshot_statistic_difference do
      arg :snapshot_statistic_a_id, non_null(:integer)
      arg :snapshot_statistic_b_id, non_null(:integer)

      resolve &SnapshotStatisticResolver.diff/2
    end
  end
end
