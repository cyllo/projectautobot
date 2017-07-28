defmodule Api.FriendshipResolver do
  import Api.Helpers, only: [preload_id_map: 2]

  alias Models.Accounts

  def send(%{friend_user_id: friend_id}, %{context: %{current_user: user}}), do: Accounts.send_friend_request(user, friend_id)
  def accept(params, %{context: %{current_user: user}}), do: Accounts.accept_friend_request(user, params)
  def reject(params, %{context: %{current_user: user}}), do: Accounts.reject_friend_request(user, params)
  def remove(params, %{context: %{current_user: user}}), do: Accounts.remove_friend(user, params)

  def create_friend_group(params, %{context: %{current_user: user}}), do: Accounts.create_user_friend_group(user, params)
  def delete_friend_group(%{id: id}, %{context: %{current_user: user}}), do: Accounts.delete_friend_group(id)
  def update_friend_group(%{id: id, name: name}, %{context: %{current_user: user}}), do: Accounts.update_friend_group(id, %{name: name})

  def remove_friend_from_group(
    %{user_friend_group_id: friend_group_id, friendship_id: friendship_id},
    %{context: %{current_user: _}}
  ) do
    Accounts.remove_friendship_from_friend_group(friend_group_id, friendship_id)
  end

  def add_friend_to_group(%{user_friend_group_id: id, friendship_id: friendship_id}, %{context: %{current_user: _}}) do
    Accounts.add_friendship_to_friend_group(id, friendship_id)
  end

  def get_friend_groups_friendships(_, friend_groups), do: preload_id_map(friend_groups, :friendships)
end
