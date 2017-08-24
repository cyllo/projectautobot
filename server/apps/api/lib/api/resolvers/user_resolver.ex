defmodule Api.UserResolver do
  import Api.Helpers, only: [preload_id_map: 3, convert_to_id_map: 3]

  alias Models.{Accounts, Game}

  def current(_, %{context: %{current_user: user}}), do: {:ok, user}
  def all(%{search: identifier}, %{context: %{current_user: user}}), do: {:ok, Accounts.search_users_excluding_user(identifier, user.id)}
  def all(%{search: identifier}, _info), do: {:ok, Accounts.search_users(identifier)}
  def all(params, _info), do: Accounts.get_all_users(params)
  def find(%{identifier: identifier}, _info), do: Accounts.find_user_by_email_or_display_name(identifier)
  def find(params, _info), do: Accounts.find_user(params)
  def create(%{client_auth_token: token} = params, _info) do
    with {:ok, battle_net_info} <- BattleNet.get_battle_net_info(token),
         {:ok, user} <- params |> Map.drop([:client_auth_token]) |> Map.merge(battle_net_info) |> Accounts.create_user do
      Task.start(fn -> BattleNet.link_gamer_tags_to_user(user) end)

      {:ok, user}
    end
  end

  def create(params, _info), do: Accounts.create_user(params)

  def update(params, %{context: %{current_user: user}}) do
    if Map.has_key?(params, :new_password) do
      Accounts.update_user_and_password(user, params)
    else
      Accounts.update_user(user, params)
    end
  end

  def connected_to_battle_net(%{client_auth_token: client_auth_token}, %{context: %{current_user: user}}) do
    BattleNet.connect_user_to_battle_net(user, client_auth_token)
  end

  def follow_user(%{user_id: followed_id}, %{context: %{current_user: user}}) do
    get_and_follow_user(user, followed_id)
  end

  def unfollow_user(%{user_id: followed_id}, %{context: %{current_user: user}}) do
    with {:ok, _} <- Accounts.remove_followed_user(user, followed_id) do
      {:ok, %{unfollowed: true}}
    end
  end

  def unfollow_gamer_tag(%{gamer_tag_id: gamer_tag_id}, %{context: %{current_user: user}}) do
    with {:ok, _} <- Game.remove_gamer_tag_follower(user, gamer_tag_id) do
      {:ok, %{unfollowed: true}}
    end
  end

  def follow_gamer_tag(%{gamer_tag_id: id}, %{context: %{current_user: current_user}}), do: Game.create_gamer_tag_follower(current_user, id)
  def follow_gamer_tag(_, _), do: {:error, "Must be logged in and provider gamer_tag_id"}

  def get_followed_gamer_tags_for_user_ids(_, user_ids), do: Accounts.get_followed_gamer_tags_by_user_ids(user_ids)
  def get_users_gamer_tags(_, users), do: preload_id_map(users, :gamer_tags, [])

  def get_followers(_, users), do: preload_id_map(users, :followers, [])
  def get_following(_, users), do: preload_id_map(users, :following, [])
  def get_friend_groups(_, users) do
    preload_id_map(users, :friend_groups, [])
      |> Map.to_list
      |> Enum.map(fn {id, values} -> {id, Enum.sort_by(values, &(&1.id))} end)
      |> Map.new
  end

  def get_friendships(params, users) do
    Accounts.get_users_friendships(users, params)
      |> convert_to_id_map(Utility.pluck(users, :id), [:user_id, :friend_id])
  end

  defp get_and_follow_user(user, following_id) do
    with {:ok, following_user} <- Accounts.get_user(following_id),
         {:ok, %{inserted_at: inserted_at, updated_at: updated_at}} <- Accounts.create_user_follower(following_user, user) do
      {:ok, %{
        following: following_user,
        user: user,
        inserted_at: inserted_at,
        updated_at: updated_at
      }}
    end
  end
end
