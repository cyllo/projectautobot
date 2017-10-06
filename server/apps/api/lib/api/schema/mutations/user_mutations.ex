defmodule Api.Schema.Mutations.UserMutations do
  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [async: 2]

  alias Api.{Middleware, UserResolver, SessionResolver}

  object :user_mutations do
    @desc "Creates a User account"
    field :create_user, :user do
      arg :display_name, non_null(:string)
      arg :email, non_null(:string)
      arg :password, non_null(:string)
      arg :client_auth_token, non_null(:string)

      resolve &async(fn -> UserResolver.create(&1, &2) end, timeout: :timer.seconds(10))
    end

    @desc """
      Updates a User"

      Restrictions: User Auth
    """
    field :update_user, :user do
      arg :display_name, :string
      arg :email, :string
      arg :primary_gamer_tag_id, :integer
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

    # @desc """
    #   Connects Battle.net to user account

    #   Restrictions: User Auth
    # """
    # field :connect_user_to_battle_net, :user do
    #   arg :client_auth_token, non_null(:string)

    #   middleware Middleware.Auth
    #   resolve &async(fn -> UserResolver.connected_to_battle_net(&1, &2) end, timeout: 20_000)
    # end
  end
end
