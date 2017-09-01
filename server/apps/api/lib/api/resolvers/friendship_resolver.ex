defmodule Api.FriendshipResolver do
  import Api.Helpers, only: [preload_id_map: 2]

  alias Models.Accounts

  def send(%{friend_user_id: friend_id}, %{context: %{current_user: user}}), do: Accounts.send_friend_request(user, friend_id)
  def accept(params, %{context: %{current_user: user}}), do: Accounts.accept_friend_request(user, params)
  def reject(params, %{context: %{current_user: user}}), do: Accounts.reject_friend_request(user, params)
  def remove(params, %{context: %{current_user: user}}), do: Accounts.remove_friend(user, params)

  def create_friend_group(params, %{context: %{current_user: user}}), do: Accounts.create_user_friend_group(user, params)
  def delete_friend_group(%{id: id}, %{context: %{current_user: user}}), do: Accounts.delete_friend_group(user, id)
  def update_friend_group(%{id: id, name: name}, %{context: %{current_user: user}}), do: Accounts.update_friend_group(user, id, %{name: name})

  def set_primary_gamer_tag(
    %{friendship_id: friendship_id, gamer_tag_id: gamer_tag_id},
    %{context: %{current_user: user}}) do
    Accounts.set_primary_gamer_tag(user, friendship_id, gamer_tag_id)
  end

  def remove_friend_from_group(
    %{user_friend_group_id: friend_group_id, friendship_id: friendship_id},
    %{context: %{current_user: user}}
  ), do: Accounts.remove_friendship_from_friend_group(user, friend_group_id, friendship_id)

  def add_friend_to_group(
    %{user_friend_group_id: id, friendship_id: friendship_id},
    %{context: %{current_user: user}}
  ), do: Accounts.add_friendship_to_friend_group(user, id, friendship_id)

  def get_primary_gamer_tags(_, friendships), do: preload_id_map(friendships, :primary_gamer_tag)
  def get_friend_groups_friendships(_, friend_groups), do: preload_id_map(friend_groups, :friendships)
  def get_friend_groups_users(_, friend_groups), do: preload_id_map(friend_groups, :user)
  def get_friendships_users(_, friendship), do: preload_id_map(friendship, :user)
  def get_friendships_friends(_, friendship), do: preload_id_map(friendship, :friend)
end
