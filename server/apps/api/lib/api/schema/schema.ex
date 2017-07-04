defmodule Api.Schema do
  use Absinthe.Schema
  import Absinthe.Resolution.Helpers, only: [async: 2]
  alias Api.{
    SnapshotStatisticsAverageResolver,
    GamerTagResolver, HeroResolver, UserResolver,
    SessionResolver, BlogResolver, Middleware,
    HeroStatisticsAverageResolver
    #, SnapshotStatisticResolver, Helpers,
  }

  import_types Absinthe.Type.Custom
  import_types Api.Schema.ScalarTypes
  import_types Api.Schema.AccountTypes
  import_types Api.Schema.GameTypes
  import_types Api.Schema.BlogTypes
  import_types Api.Schema.SnapshotTypes
  import_types Api.Schema.StatisticTypes
  import_types Api.Schema.SessionTypes
  import_types Api.Schema.StatisticAverageTypes
  import_types Api.Schema.HeroStatisticsAverageTypes
  import_types Api.Schema.SnapshotStatisticsAverageTypes

  query do
    field :gamer_tag, :gamer_tag do
      arg :id, :integer
      arg :tag, :string

      resolve &GamerTagResolver.find/2
    end

    field :gamer_tags, list_of(:gamer_tag) do
      arg :tags, list_of(:string)
      arg :user_id, :integer
      arg :region, :string
      arg :platform, :string

      resolve &GamerTagResolver.all/2
    end

    field :user, :user do
      arg :id, :integer
      arg :identifier, :string
      arg :email, :string
      arg :username, :string

      resolve &UserResolver.find/2
    end

    field :hero, :hero do
      arg :id, :integer
      arg :name, :string
      arg :code, :string

      resolve &HeroResolver.find/2
    end

    field :heroes, list_of(:hero) do
      resolve &HeroResolver.all/2
    end

    field :blog_post, :blog_post do
      arg :id, :integer
      arg :title, :string

      resolve &BlogResolver.find/2
    end

    field :blog_posts, list_of(:blog_post) do
      arg :last, :integer

      resolve &BlogResolver.all/2
    end

    @desc "Search gamer tag by tag name"
    field :search_gamer_tag, list_of(:gamer_tag) do
      arg :tag, non_null(:string)

      resolve &GamerTagResolver.search/2
    end

    field :hero_statistics_average, :hero_statistics_average do
      arg :hero_id, :integer
      # arg :name, :string

      resolve &HeroStatisticsAverageResolver.find_hero_and_average/2
    end

    field :snapshots_statistics_average, :snapshot_statistics_average do
      arg :is_competitive, :boolean

      resolve &SnapshotStatisticsAverageResolver.average/2
    end
  end

  mutation do
    @desc "Scrapes a GamerTag"
    field :scrape_gamer_tag, :gamer_tag do
      arg :id, non_null(:integer)

      resolve &async(fn -> GamerTagResolver.scrape(&1, &2) end, timeout: 30_000)
    end

    @desc "Creates a User account"
    field :create_user, :user do
      arg :username, non_null(:string)
      arg :email, non_null(:string)
      arg :password, non_null(:string)

      resolve &UserResolver.create/2
    end

    @desc "Connects Battle.net to user account"
    field :connect_user_to_battle_net, :user do
      arg :client_auth_token, :string

      middleware Middleware.Auth
      resolve &UserResolver.connected_to_battle_net/2
    end

    @desc "Login a User and return token and user info"
    field :login_user, :current_session do
      arg :identifier, non_null(:string)
      arg :password, non_null(:string)

      resolve &SessionResolver.login/2
    end

    field :logout_user, :logout_info do
      middleware Middleware.Auth
      resolve &SessionResolver.logout/2
    end

    @desc "Follows a User"
    field :follow_user, :follow_user_result do
      arg :id, non_null(:integer)
      arg :following_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &UserResolver.follow/2
    end

    @desc "Create a BlogPost"
    field :create_blog_post, :blog_post do
      arg :title, non_null(:string)
      arg :content, non_null(:string)

      middleware Middleware.Auth, admin_only: true
      resolve &BlogResolver.create/2
    end

    @desc "Follows a GamerTag"
    field :follow_gamer_tag, :follow_gamer_tag_result do
      arg :gamer_tag_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &UserResolver.follow_gamer_tag/2
    end
  end

  def middleware(middleware, _field, %{identifier: :mutation}) do
    middleware ++ [Middleware.ChangesetErrorFormatter]
  end

  def middleware(middleware, _, _) do
    middleware
  end
end
