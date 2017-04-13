defmodule Api.Schema.GameTypes do
  require IEx
  use Absinthe.Schema.Notation
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

    field :snapshot_statistics, list_of(:snapshot_statistic) do
      resolve fn gamer_tag, _, _ ->
        batch({SnapshotStatisticResolver, :get_gamer_tag_snapshot_statistics}, gamer_tag.id, &(&1))
      end
    end
  end

  @desc "Overwatch heroes"
  object :hero do
    field :id, :integer
    field :name, :string
    field :code, :string
  end
end
