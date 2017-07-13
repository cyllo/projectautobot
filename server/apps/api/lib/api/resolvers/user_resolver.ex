defmodule Api.UserResolver do
  alias Models.{Accounts, Game}

  def current(_, %{context: %{current_user: user}}), do: {:ok, user}
  def create(params, _info), do: Accounts.create_user(params)
  def find(params, _info), do: Accounts.find_user(params)
  def update(params, %{context: %{current_user: user}}) do
    if Map.has_key?(params, :new_password) do
      Accounts.update_user_and_password(user, params)
    else
      Accounts.update_user(user, params)
    end
  end

  def connected_to_battle_net(%{client_auth_token: client_auth_token}, %{context: %{current_user: user}}) do
    {:ok, %{user| battle_net_tag: "SomeTag#1234", battle_net_id: Enum.random(1000..2000000)}}
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
