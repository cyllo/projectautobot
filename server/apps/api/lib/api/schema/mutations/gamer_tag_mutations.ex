defmodule Api.Schema.Mutations.GamerTagMutations do
  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [async: 2]

  alias Api.{Middleware, UserResolver, GamerTagResolver}

  object :gamer_tag_mutations do
    @desc "Scrapes a GamerTag"
    field :scrape_gamer_tag, :gamer_tag do
      arg :id, :integer
      arg :tag, :string
      arg :region, :string
      arg :platform, :string

      resolve &async(fn -> GamerTagResolver.scrape(&1, &2) end, timeout: :timer.seconds(90))
    end

    @desc "Search gamer tag by tag name"
    field :search_gamer_tag, list_of(:gamer_tag) do
      arg :tag, non_null(:string)

      resolve &async(fn -> GamerTagResolver.search(&1, &2) end, timeout: :timer.seconds(30))
    end


    @desc """
      Follows a GamerTag

      Restrictions: User Auth
    """
    field :follow_gamer_tag, :follow_gamer_tag_result do
      arg :gamer_tag_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &UserResolver.follow_gamer_tag/2
    end

    @desc """
      Unfollows a GamerTag

      Restrictions: User Auth
    """
    field :unfollow_gamer_tag, :unfollow_result do
      arg :gamer_tag_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &UserResolver.unfollow_gamer_tag/2
    end

    @desc """
      Starts watching a GamerTag
    """
    field :start_gamer_tag_watch, :gamer_tag_watch_status do
      arg :id, non_null(:integer)

      resolve &GamerTagResolver.start_watch/2
    end

    @desc """
      Ends watching a GamerTag
    """
    field :end_gamer_tag_watch, :gamer_tag_watch_status do
      arg :id, non_null(:integer)

      resolve &GamerTagResolver.end_watch/2
    end
  end
end
