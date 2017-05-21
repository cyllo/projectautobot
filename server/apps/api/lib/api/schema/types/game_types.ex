defmodule Api.Schema.GameTypes do
  require IEx
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]
  alias Api.SnapshotStatisticResolver

  @desc "A gamer tag profile that's region/platform specific"
  object :gamer_tag do
    field :id, :integer

    field :tag, :string
    field :overwatch_name, :string
    field :portrait_url, :string
    field :total_games_won, :integer

    field :competitive_level, :integer
    field :competitive_rank_url, :string

    field :region, :string
    field :platform, :string

    field :level, :integer
    field :level_url, :string

    timestamp_types

    field :snapshot_statistics, list_of(:snapshot_statistic) do
      arg :first, :integer

      resolve fn gamer_tag, args, _ ->
        batch(
          {SnapshotStatisticResolver, :get_gamer_tag_snapshot_statistics, args},
          gamer_tag.id,
          &{:ok, Map.get(&1, gamer_tag.id)}
        )
      end
    end
  end

  @desc "Overwatch heroes"
  object :hero do
    field :id, :integer
    field :name, :string
    field :code, :string
    timestamp_types
  end
end
