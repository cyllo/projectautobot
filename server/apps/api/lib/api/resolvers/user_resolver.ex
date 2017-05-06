defmodule Api.UserResolver do
  alias Models.Accounts

  def create(params, _info), do: Accounts.create_user(params)
  def find(%{identifier: identifier}, _info), do: Accounts.find_user_by_email_or_username(identifier)
  def find(params, _info), do: Accounts.find_user(params)

  def follow(%{id: id, following_id: following_id}, info) do
    current_user_id = info.context |> Map.get(:current_user) |> Map.get(:id)

    if current_user_id === id do
      get_and_follow_user(id, following_id)
    else
      {:error, "cannot setup followers for other user"}
    end
  end

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
