defmodule Api.Schema do
  use Absinthe.Schema
  alias Api.{GamerTagResolver, HeroResolver, ProfileSearchResolver}

  import_types Absinthe.Type.Custom
  import_types Api.Schema.ScalarTypes
  import_types Api.Schema.AccountTypes
  import_types Api.Schema.GameTypes
  import_types Api.Schema.SnapshotTypes
  import_types Api.Schema.StatisticTypes

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

    field :hero, :hero do
      arg :id, :id
      arg :name, :string
      arg :code, :string

      resolve &HeroResolver.find/2
    end

    field :heroes, list_of(:hero) do
      resolve &HeroResolver.all/2
    end

    field :search_gamer_tag, list_of(:gamer_tag) do
      arg :tag, :string

      resolve &ProfileSearchResolver.find/2
    end
  end
end
