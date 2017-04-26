defmodule Api.Schema do
  use Absinthe.Schema
  alias Api.{GamerTagResolver, HeroResolver, UserResolver, SessionResolver, BlogResolver}

  import_types Absinthe.Type.Custom
  import_types Api.Schema.ScalarTypes
  import_types Api.Schema.AccountTypes
  import_types Api.Schema.GameTypes
  import_types Api.Schema.SnapshotTypes
  import_types Api.Schema.StatisticTypes
  import_types Api.Schema.SessionTypes

  query do
    field :gamer_tag, :gamer_tag do
      arg :id, :integer
      arg :tag, :string
      arg :snapshot_statistics, list_of(:snapshot_statistic)

      resolve &GamerTagResolver.find/2
    end

    field :gamer_tags, list_of(:gamer_tag) do
      arg :tags, list_of(:string)
      arg :user_id, :integer
      arg :region, :string
      arg :platform, :string

      resolve &GamerTagResolver.all/2
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
      arg :id, non_null(:integer)

      resolve &BlogResolver.find/2
    end

    field :blog_posts, list_of(:blog_post) do
      arg :title, :string

      resolve &BlogResolver.all/2
    end


    @desc "Search gamer tag by tag name"
    field :search_gamer_tag, list_of(:gamer_tag) do
      arg :tag, non_null(:string)

      resolve &GamerTagResolver.search/2
    end
  end

  mutation do
    @desc "Scrapes a gamer_tag"
    field :scrape_gamer_tag, :gamer_tag do
      arg :id, non_null(:integer)

      resolve &GamerTagResolver.scrape/2
    end

    @desc "Creates a user account"
    field :create_user, :user do
      arg :username, non_null(:string)
      arg :email, non_null(:string)
      arg :password, non_null(:string)

      resolve &UserResolver.create/2
    end

    field :login_user, :current_session do
      arg :identifier, non_null(:string)
      arg :password, non_null(:string)

      resolve &SessionResolver.login/2
    end

    field :create_blog_post, :blog_post do
      arg :title, non_null(:string)
      arg :content, non_null(:string)

      resolve &BlogResolver.all/2
    end
  end

  def middleware(middleware, _field, %{identifier: :mutation}) do
    middleware ++ [Api.Middleware.ChangesetErrorFormatter]
  end

  def middleware(middleware, _, _) do
    middleware
  end
end
