defmodule Api.Schema.AccountTypes do
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]
  alias Api.UserResolver

  @desc "A user object for an account which owns gamer tags"
  object :user do
    field :id, :integer
    field :username, :string
    field :email, :string
    field :battle_net_id, :integer
    field :battle_net_tag, :string

    field :friends, list_of(:friendship) do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_friends_by_ids},
          user,
          &{:ok, Map.get(&1, user.id)}
        )
      end
    end

    field :followers, list_of(:user) do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_followers},
          user,
          &{:ok, Map.get(&1, user.id)}
        )
      end
    end

    field :following, list_of(:user) do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_following},
          user,
          &{:ok, Map.get(&1, user.id)}
        )
      end
    end

    field :followed_gamer_tags, list_of(:gamer_tag) do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_followed_gamer_tags_for_user_ids},
          user.id,
          &{:ok, Map.get(&1, user.id)}
        )
      end
    end

    timestamp_types
  end

  @desc "Friendships 1 <=> 1 for user"
  object :friendship do
    field :id, :integer
    field :is_accepted, :boolean
    field :user, :user
    field :friend, :user
    timestamp_types
  end

  @desc "followers 1 => 1 for user"
  object :follow_user_result do
    field :following, :user
    field :user, :user
    timestamp_types
  end

  object :follow_gamer_tag_result do
    field :gamer_tag, :gamer_tag
    field :user, :user
    timestamp_types
  end
end
