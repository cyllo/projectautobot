defmodule Api.UserResolver do
  import Api.Helpers, only: [preload_id_map: 3]

  alias Models.{Accounts, Game}

  def current(_, %{context: %{current_user: user}}), do: {:ok, user}
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

  def follow(%{id: id, following_id: following_id}, info) do
    current_user_id = info.context |> Map.get(:current_user) |> Map.get(:id)

    if current_user_id === id do
      get_and_follow_user(id, following_id)
    else
      {:error, "cannot setup followers for other user"}
    end
  end

  def follow_gamer_tag(%{gamer_tag_id: id}, %{context: %{current_user: current_user}}), do: Game.create_gamer_tag_follower(current_user, id)
  def follow_gamer_tag(_, _), do: {:error, "Must be logged in and provider gamer_tag_id"}

  def get_followed_gamer_tags_for_user_ids(_, user_ids), do: Accounts.get_followed_gamer_tags_by_user_ids(user_ids)
  def get_users_gamer_tags(_, users), do: preload_id_map(users, :gamer_tags, [])

  defp get_and_follow_user(id, following_id) do
    with [user, following_user] <- Accounts.get_users_by_ids([id, following_id]),
         {:ok, following_user} <- Accounts.create_user_follower(following_user, user) do
      {:ok, %{following: following_user, user: user}}
    else
      [_] ->
        message = if id === following_id, do: "no user found with id: #{id}", else: "no following user found with id: #{following_id}"
        {:error, message}

      res -> res
    end
  end
end
