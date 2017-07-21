defmodule Api.FriendshipResolver do
  alias Models.Accounts

  def send(%{friend_user_id: friend_id}, %{context: %{current_user: user}}), do: Accounts.send_friend_request(user, friend_id)
  def accept(params, %{context: %{current_user: user}}), do: Accounts.accept_friend_request(user, params)
  def reject(params, %{context: %{current_user: user}}), do: Accounts.reject_friend_request(user, params)
  def remove(params, %{context: %{current_user: user}}), do: Accounts.remove_friend(user, params)
end
