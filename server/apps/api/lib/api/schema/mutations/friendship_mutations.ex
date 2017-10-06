defmodule Api.Schema.Mutations.FriendshipMutations do
  use Absinthe.Schema.Notation

  alias Api.{Middleware, FriendshipResolver}

  object :friendship_mutations do
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
      Sets the primary gamer tag for a friendship, this is the primary
      profile you will see

      Restrictions: User Auth
    """
    field :set_friendship_primary_gamer_tag, :friendship do
      arg :friendship_id, non_null(:integer)
      arg :gamer_tag_id, non_null(:integer)

      middleware Middleware.Auth
      resolve &FriendshipResolver.set_primary_gamer_tag/2
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
  end
end
