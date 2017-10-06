defmodule Api.Schema.Queries.GamerTagQueries do
  use Absinthe.Schema.Notation

  alias Api.GamerTagResolver

  object :gamer_tag_queries do
    field :gamer_tag, :gamer_tag do
      arg :id, :integer
      arg :tag, :string
      arg :region, :string
      arg :platform, :string

      resolve &GamerTagResolver.find/2
    end

    field :gamer_tags, list_of(:gamer_tag) do
      arg :tags, list_of(:string)
      arg :ids, list_of(:integer)
      arg :user_id, :integer
      arg :region, :string
      arg :platform, :string

      resolve &GamerTagResolver.all/2
    end

    @desc """
      Chunk gamer tags ids by statistic path

      Statistics path can be something like `["profile_snapshot_statistic", "profile_statistic", "competitive_level"]`

      Returns `{1000: [1, 2], 1050: [3, 34]}`
    """
    field :chunked_gamer_tag_ids, :map do
      arg :groups_of, non_null(:integer)
      arg :statistic_path, non_null(list_of(non_null(:string)))
      arg :statistics_max, :integer

      resolve &GamerTagResolver.get_chunked_gamer_tag_ids/2
    end
  end
end
