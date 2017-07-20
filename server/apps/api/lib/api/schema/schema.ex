defmodule Api.Schema do
  use Absinthe.Schema
  import Absinthe.Resolution.Helpers, only: [async: 2]
  alias Api.{
    Schema,
    SnapshotStatisticsAverageResolver,
    GamerTagResolver, HeroResolver, UserResolver,
    SessionResolver, BlogResolver, Middleware,
    HeroStatisticsAverageResolver
    #, SnapshotStatisticResolver
  }

  import_types Absinthe.Type.Custom
  import_types Schema.ScalarTypes
  import_types Schema.AccountTypes
  import_types Schema.GameTypes
  import_types Schema.BlogTypes
  import_types Schema.SnapshotTypes
  import_types Schema.StatisticTypes
  import_types Schema.SessionTypes
  import_types Schema.StatisticAverageTypes
  import_types Schema.HeroStatisticsAverageTypes
  import_types Schema.SnapshotStatisticsAverageTypes
  import_types Schema.ActionTypes

  query do
    @desc """
      Gets current User when logged in

      Restrictions: User Auth
    """
    field :me, :user do
      middleware Middleware.Auth
      resolve &UserResolver.current/2
    end

    field :gamer_tag, :gamer_tag do
      arg :id, :integer
      arg :tag, :string
      arg :region, :string
      arg :platform, :string

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
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime

      resolve &BlogResolver.all/2
    end

    @desc "Search gamer tag by tag name"
    field :search_gamer_tag, list_of(:gamer_tag) do
      arg :tag, non_null(:string)

      resolve &GamerTagResolver.search/2
    end

    field :hero_statistics_average, :hero_statistics_average do
      arg :hero_id, :integer
      arg :is_competitive, :boolean
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
      arg :id, :integer
      arg :tag, :string
      arg :region, :string
      arg :platform, :string

      resolve &async(fn -> GamerTagResolver.scrape(&1, &2) end, timeout: 60_000)
    end

    @desc "Creates a User account"
    field :create_user, :user do
      arg :display_name, non_null(:string)
      arg :email, non_null(:string)
      arg :password, non_null(:string)
      arg :client_auth_token, :string

      resolve &UserResolver.create/2
    end

    @desc """
      Updates a User"

      Restrictions: User Auth
    """
    field :update_user, :user do
      arg :display_name, :string
      arg :email, :string
      arg :old_password, :string
      arg :new_password, :string

      middleware Middleware.Auth
      resolve &UserResolver.update/2
    end

    @desc """
      Login a User and return token and user info
      Token is to be set onto an `authorization` header like so:
      `authorization: Bearer JFI$12edjA$@!H!2j!J$KSAL!@`
    """
    field :login_user, :current_session do
      arg :email, non_null(:string)
      arg :password, non_null(:string)

      resolve &SessionResolver.login/2
    end

    @desc """
      Logout a User

      Restrictions: User Auth
    """
    field :logout_user, :logout_info do
      middleware Middleware.Auth
      resolve &SessionResolver.logout/2
    end

    @desc """
      Follows a User

      Restrictions: User Auth
    """
    field :follow_user, :follow_user_result do
      arg :id, non_null(:integer)
      arg :following_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &UserResolver.follow/2
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
      Connects Battle.net to user account

      Restrictions: User Auth
    """
    field :connect_user_to_battle_net, :user do
      arg :client_auth_token, non_null(:string)

      middleware Middleware.Auth
      resolve &async(fn -> UserResolver.connected_to_battle_net(&1, &2) end, timeout: 20_000)
    end

    @desc """
      Create a BlogPost

      Restrictions: Admin Only
    """
    field :create_blog_post, :blog_post do
      arg :title, non_null(:string)
      arg :content, non_null(:string)
      arg :summary, non_null(:string)
      arg :thumbnail_url, non_null(:string)
      arg :blog_categories, non_null(list_of(non_null(:blog_category_input)))

      middleware Middleware.Auth, admin_only: true
      resolve &BlogResolver.create/2
    end

    @desc """
      Delete a BlogPost

      Restrictions: Admin Only
    """
    field :delete_blog_post, :deleted_info do
      arg :id, non_null(:integer)

      middleware Middleware.Auth, admin_only: true
      resolve &BlogResolver.delete/2
    end

    @desc """
      Update a BlogPost

      Restrictions: Admin Only
    """
    field :update_blog_post, :blog_post do
      arg :id, non_null(:integer)
      arg :content, :string
      arg :title, :string

      middleware Middleware.Auth, admin_only: true
      resolve &BlogResolver.update/2
    end
  end

  def middleware(middleware, _field, %{identifier: :mutation}) do
    middleware ++ [Middleware.ChangesetErrorFormatter]
  end

  def middleware(middleware, _, _) do
    middleware
  end
end
