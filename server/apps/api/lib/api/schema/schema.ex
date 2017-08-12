defmodule Api.Schema do
  use Absinthe.Schema
  import Absinthe.Resolution.Helpers, only: [async: 2]
  alias Api.{
    Schema,
    LeaderboardSnapshotResolver,
    AverageStatisticsSnapshotResolver,
    SnapshotStatisticsAverageResolver,
    GamerTagResolver, HeroResolver, UserResolver,
    SessionResolver, BlogResolver, Middleware,
    HeroStatisticsAverageResolver, FriendshipResolver
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
  import_types Schema.LeaderboardSnapshotStatisticTypes
  import_types Schema.SnapshotStatisticsAverageTypes
  import_types Schema.ActionTypes
  import_types Schema.FriendTypes

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

    field :users, list_of(:user) do
      arg :search, :string

      resolve &UserResolver.all/2
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

    field :blog_categories, list_of(:blog_category) do
      resolve &BlogResolver.all_categories/2
    end

    field :blog_posts, list_of(:blog_post) do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime
      arg :blog_categories, list_of(non_null(:blog_category_input))

      resolve &BlogResolver.all/2
    end

    field :hero_statistics_average, :hero_statistics_average do
      arg :hero_id, non_null(:integer)
      arg :type, non_null(:snapshot_statistic_type)

      resolve &HeroStatisticsAverageResolver.find_hero_and_average/2
    end

    field :snapshots_statistics_average, :snapshot_statistics_average do
      arg :type, non_null(:snapshot_statistic_type)

      resolve &SnapshotStatisticsAverageResolver.average/2
    end

    field :leaderboard_snapshot_statistics, list_of(:leaderboard_snapshot_statistic) do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime

      resolve &LeaderboardSnapshotResolver.all/2
    end

    field :leaderboard_snapshot_statistic, :leaderboard_snapshot_statistic do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime

      resolve &LeaderboardSnapshotResolver.find/2
    end

    field :statistics_averages_snapshot, :statistics_averages_snapshot do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime

      resolve &AverageStatisticsSnapshotResolver.all/2
    end

    field :statistics_averages_snapshots, list_of(:statistics_averages_snapshot) do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime

      resolve &AverageStatisticsSnapshotResolver.find/2
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

    @desc "Search gamer tag by tag name"
    field :search_gamer_tag, list_of(:gamer_tag) do
      arg :tag, non_null(:string)

      resolve &async(fn -> GamerTagResolver.search(&1, &2) end, timeout: 30_000)
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
      arg :user_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &UserResolver.follow_user/2
    end

    @desc """
      Unfollows a User

      Restrictions: User Auth
    """
    field :unfollow_user, :unfollow_result do
      arg :user_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &UserResolver.unfollow_user/2
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
      Unfollows a User

      Restrictions: User Auth
    """
    field :unfollow_gamer_tag, :unfollow_result do
      arg :gamer_tag_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &UserResolver.unfollow_gamer_tag/2
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
      Sends a friend request

      Restrictions: User Auth
    """
    field :send_friend_request, :friendship do
      arg :friend_user_id, :integer

      middleware Middleware.Auth
      resolve &FriendshipResolver.send/2
    end

    @desc """
      Accepts a friend request

      Restrictions: User Auth
    """
    field :accept_friend_request, :friendship do
      arg :friendship_id, :integer
      arg :friend_user_id, :integer

      middleware Middleware.Auth
      resolve &FriendshipResolver.accept/2
    end

    @desc """
      Rejects a friend request

      Restrictions: User Auth
    """
    field :reject_friend_request, :rejected_info do
      arg :friendship_id, :integer
      arg :friend_user_id, :integer

      middleware Middleware.Auth
      resolve &FriendshipResolver.reject/2
    end

    @desc """
      Removes a current friendship

      Restrictions: User Auth
    """
    field :remove_friend, :removed_info do
      arg :friendship_id, :integer
      arg :friend_user_id, :integer

      middleware Middleware.Auth
      resolve &FriendshipResolver.remove/2
    end

    @desc """
      Creates a friend group to add friends under a label

      Restrictions: User Auth
    """
    field :create_friend_group, :friend_group do
      arg :name, non_null(:string)
      arg :friendships, list_of(non_null(:friendship_input))

      middleware Middleware.Auth
      resolve &FriendshipResolver.create_friend_group/2
    end

    @desc """
      Adds a friendship to an existing friend group

      Restrictions: User Auth
    """
    field :add_friend_group_friendship, :friend_group do
      arg :user_friend_group_id, non_null(:integer)
      arg :friendship_id, non_null(:integer)
      # arg :friendships, list_of(non_null(:friendship_input))

      middleware Middleware.Auth
      resolve &FriendshipResolver.add_friend_to_group/2
    end

    @desc """
      Remove a friendship to an existing friend group

      Restrictions: User Auth
    """
    field :remove_friend_group_friendship, :friend_group do
      arg :user_friend_group_id, non_null(:integer)
      arg :friendship_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &FriendshipResolver.remove_friend_from_group/2
    end

    @desc """
      Updates a friend group

      Restrictions: User Auth
    """
    field :update_friend_group, :friend_group do
      arg :id, non_null(:integer)
      arg :name, non_null(:string)

      middleware Middleware.Auth
      resolve &FriendshipResolver.update_friend_group/2
    end

    @desc """
      Delete a friend group

      Restrictions: User Auth
    """
    field :delete_friend_group, :deleted_info do
      arg :id, non_null(:integer)

      middleware Middleware.Auth
      resolve &FriendshipResolver.delete_friend_group/2
    end

    @desc """
      Create a BlogPost

      Restrictions: Admin Only
    """
    field :create_blog_post, :blog_post do
      arg :title, non_null(:string)
      arg :content, non_null(:string)
      arg :hero_image_url, non_null(:string)
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
      arg :title, :string
      arg :content, :string
      arg :hero_image_url, :string
      arg :summary, :string
      arg :thumbnail_url, :string

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
