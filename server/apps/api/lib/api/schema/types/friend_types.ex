defmodule Api.Schema.FriendTypes do
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]

  alias Api.FriendshipResolver

  @desc "Friendships 1 <=> 1 for user"
  object :friendship do
    field :id, :integer
    field :is_accepted, :boolean
    field :user_id, :integer
    field :friend_id, :integer
    field :user, :user
    field :friend, :user
    timestamp_types
  end

  object :friend_group do
    field :id, :integer
    field :name, :string
    field :user, :user

    field :friendships, list_of(:friendship) do
      resolve fn friend_group, _, _ ->
        batch(
          {FriendshipResolver, :get_friend_groups_friendships},
          friend_group,
          &{:ok, Map.get(&1, friend_group.id)}
        )
      end
    end

    timestamp_types
  end

  input_object :friendship_input do
    field :friend_id, :integer
    field :friendship_id, :integer
  end
end
