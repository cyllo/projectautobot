defmodule Api.Schema do
  use Absinthe.Schema
  alias Api.GamerTagResolver

  import_types Api.Schema.AccountTypes
  import_types Api.Schema.GameTypes
  import_types Api.Schema.SnapshotTypes
  import_types Api.Schema.StatisticTypes
  import_types Api.Schema.TimeTypes

  query do
    field :gamer_tag, :gamer_tag do
      arg :id, :id
      arg :tag, :string
      arg :snapshot_statistics, list_of(:snapshot_statistic)

      resolve &GamerTagResolver.find/2
    end

    field :gamer_tags, list_of(:gamer_tag) do
      arg :tags, list_of(:string)
      arg :user_id, :id
      arg :region, :string
      arg :platform, :string

      resolve &GamerTagResolver.all/2
    end
  end
end
