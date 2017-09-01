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
    field :primary_gamer_tag_id, :integer

    field :primary_gamer_tag, :gamer_tag do
      resolve fn friendship, _, _ ->
        batch(
          {FriendshipResolver, :get_primary_gamer_tags},
          friendship,
          &{:ok, Map.get(&1, friendship.id)}
        )
      end
    end

    field :user, :user do
      resolve fn friendship, _, _ ->
        batch(
          {FriendshipResolver, :get_friendships_users},
          friendship,
          &{:ok, Map.get(&1, friendship.id)}
        )
      end
    end

    field :friend, :user do
      resolve fn friendship, _, _ ->
        batch(
          {FriendshipResolver, :get_friendships_friends},
          friendship,
          &{:ok, Map.get(&1, friendship.id)}
        )
      end
    end

    timestamp_types
  end

  object :friend_group do
    field :id, :integer
    field :name, :string

    field :user, :user do
      resolve fn friend_group, _, _ ->
        batch(
          {FriendshipResolver, :get_friend_groups_users},
          friend_group,
          &{:ok, Map.get(&1, friend_group.id)}
        )
      end
    end

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
    field :friend_user_id, :integer
    field :friendship_id, :integer
  end
end
