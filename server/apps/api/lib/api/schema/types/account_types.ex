defmodule Api.Schema.AccountTypes do
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]
  alias Api.UserResolver

  @desc "A user object for an account which owns gamer tags"
  object :user do
    field :id, :integer
    field :display_name, :string
    field :email, :string
    field :battle_net_id, :integer
    field :battle_net_tag, :string
    field :primary_gamer_tag_id, :integer
    field :is_admin, :boolean

    field :friendships, list_of(:friendship) do
      arg :is_accepted, :boolean
      arg :is_sender, :boolean

      resolve fn user, args, _ ->
        batch(
          {UserResolver, :get_friendships, args},
          user,
          &{:ok, Map.get(&1, user.id, [])}
        )
      end
    end

    field :followers, list_of(:user) do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_followers},
          user,
          &{:ok, Map.get(&1, user.id, [])}
        )
      end
    end

    field :following, list_of(:user) do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_following},
          user,
          &{:ok, Map.get(&1, user.id, [])}
        )
      end
    end

    field :primary_gamer_tag, :gamer_tag do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_primary_gamer_tags},
          user,
          &{:ok, Map.get(&1, user.id)}
        )
      end
    end

    field :gamer_tags, list_of(:gamer_tag) do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_users_gamer_tags},
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
          &{:ok, Map.get(&1, user.id, [])}
        )
      end
    end

    field :friend_groups, list_of(:friend_group) do
      resolve fn user, _, _ ->
        batch(
          {UserResolver, :get_friend_groups},
          user,
          &{:ok, Map.get(&1, user.id, [])}
        )
      end
    end

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
