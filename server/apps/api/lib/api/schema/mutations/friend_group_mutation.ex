defmodule Api.Schema.Mutations.UserFriendGroupMutations do
  use Absinthe.Schema.Notation

  alias Api.{Middleware, FriendshipResolver}

  object :user_friend_group_mutations do
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
  end
end
