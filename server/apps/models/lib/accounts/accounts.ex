defmodule Models.Accounts do
  use Models.Model
  alias Models.{Repo, Model}
  alias Models.Game.GamerTagUserFollower
  alias Models.Accounts.{
    User, Follower,
    Friendship, UserFriendGroup,
    UserFriendGroupFriendship
  }

  @incorrect_password_message "password is not correct"

  Model.create_model_methods(User)
  Model.create_model_methods(UserFriendGroup)

  @doc """
  Creates a user from params

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, _} = Models.Accounts.create_user(%{display_name: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:error, %{errors: errors}} = Models.Accounts.create_user(%{display_name: "test", password: "password", email: "eamil2@g.ca"})
      iex> {:display_name, {"has already been taken", []}} in errors
      true
      iex> {:error, %{errors: errors}} = Models.Accounts.create_user(%{display_name: "tobias", password: "password", email: "eamil@g.ca"})
      iex> {:email, {"has already been taken", []}} in errors
      true

  """
  def create_user(params) do
    changeset = User.create_changeset params

    if (changeset.valid?), do: Repo.insert(changeset), else: {:error, changeset}
  end

  @doc """
  Creates a user from params

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, user} = Models.Accounts.create_user(%{display_name: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:ok, new_user} = Models.Accounts.create_user(%{display_name: "Tester", password: "password", email: "email@g.ca"})
      iex> {:ok, _} = Models.Accounts.create_user_follower user, new_user
      iex> length(Repo.get(user.id, :followers).followers)
      1


  """
  def create_user_follower(user, user_follower) do
    with {:ok, follower} <- %Follower{user: user, follower: user_follower} |> Follower.changeset |> Repo.insert do
      {:ok, follower}
    end
  end

  def remove_followed_user(user, followed_user_id) do
    with {:ok, follower} <- get_followed_user(user, followed_user_id),
         {1, _} <- Ecto.Query.where(Follower, user_id: ^followed_user_id, follower_id: ^user.id) |> Repo.delete_all do
      {:ok, follower}
    else
      {0, _} -> {:error, "cannot remove user that doesn't exist"}
      e -> e
    end
  end

  @doc """
  Finds user by `user_name` and verifies `password`

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:error, error} = Models.Accounts.find_user_and_confirm_password("test", "pass")
      iex> is_bitstring(error)
      true
      iex> Models.Accounts.create_user(%{display_name: "bill", password: "password", email: "email@email.com"})
      iex> {:error, error} = Models.Accounts.find_user_and_confirm_password("bill", "pass")
      iex> "password is not correct" === error
      true
      iex> {:ok, user} = Models.Accounts.find_user_and_confirm_password("bill", "password")
      iex> user.display_name
      "bill"
      iex> {:ok, user} = Models.Accounts.find_user_and_confirm_password("email@email.com", "password")
      iex> user.display_name
      "bill"

  """
  def find_user_and_confirm_password(email, password) do
    with {:ok, user} <- find_user(email: email) do
      check_user_password(user, password)
    end
  end

  def find_user_by_email_or_display_name(identifier) do
    case from(User, where: [display_name: ^identifier], or_where: [email: ^identifier]) |> Repo.one do
      nil -> {:error, "no user found with email or display name: #{identifier}"}
      user -> {:ok, user}
    end
  end

  def search_users_excluding_user(identifier, exclude_id) do
    User.search_query(identifier)
      |> Ecto.Query.where([u], u.id != ^exclude_id)
      |> Repo.all
  end

  def search_users(identifier) do
    User.search_query(identifier)
      |> Repo.all
  end

  def update_user_and_password(user_id, params) when is_integer(user_id), do: get_user(user_id) |> update_user_and_password(params)
  def update_user_and_password(user, %{old_password: old_password, new_password: new_password} = params) do
    with true <- old_password !== new_password || {:error, "passwords cannot be the same"},
         {:ok, _} <- check_user_password(user, old_password),
         {:ok, user} <- update_user(user, Map.put(params, :password, new_password)) do
      {:ok, user}
    else
      {:error, @incorrect_password_message} -> {:error, "old " <> @incorrect_password_message}
      {:error, res} -> {:error, res}
    end
  end

  def update_user_and_password(_, %{new_password: _}), do: {:error, "must provide old password to update password"}

  defp check_user_password(user, password) do
    if User.has_correct_pw?(user, password) do
      {:ok, user}
    else
      {:error, @incorrect_password_message}
    end
  end

  def get_followed_gamer_tags_by_user_ids(user_ids) do
    from(gtuf in GamerTagUserFollower, preload: :gamer_tag, where: gtuf.user_id in ^user_ids)
      |> Repo.all
      |> group_followed_gamer_tags_by_user_id
  end

  defp group_followed_gamer_tags_by_user_id(followed_gamer_tags) do
    Enum.reduce(followed_gamer_tags, %{}, fn follower, accum ->
      if Map.has_key?(accum, follower.user_id) and !(follower.gamer_tag in accum[follower.user_id]) do
        Map.put(accum, follower.user_id, accum[follower.user_id]++ [follower.gamer_tag])
      else
        Map.put(accum, follower.user_id, [follower.gamer_tag])
      end
    end)
  end

  @doc """
  sends a friend request to a user

  Returns `{:ok, friendship}` or `{:error, error}`.

  ## Examples

      iex> {:ok, friend} = Models.Accounts.create_user(%{display_name: "bill", password: "password", email: "email@email.com"})
      iex> {:ok, user} = Models.Accounts.create_user(%{display_name: "tom", password: "password", email: "tom@email.com"})
      iex> {:ok, _} = Models.Accounts.send_friend_request(friend, requesting_user)
      iex> Models.Accounts.send_friend_request(friend, requesting_user)
      {:error, "friend request already exists"}
      iex> Models.Accounts.send_friend_request(requesting_user, friend)
      {:error, "friend request already exists"}
      iex> {:ok, friendship} = Models.Accounts.accept_friend_request(requesting_user, friend)
      iex> friendship.is_accepted
      true

  """
  def send_friend_request(user, future_friend_id) do
    with {:ok, friend} <- get_friend(user.id, future_friend_id),
         nil <- get_user_any_friendship(user.id, future_friend_id),
         {:ok, %{user_friendship: friendship}} <- Repo.transaction(Friendship.create_friendship_query(user, friend)) do
      {:ok, friendship}
    else
      {%Friendship{}, %Friendship{}} = friendships -> handle_send_friendship_error(user, friendships)
       e -> e
    end
  end

  @doc """
  Accepts a friend request

  Returns `{:ok, friendship}` or `{:error, error}`.

  ## Examples

      iex> {:ok, user} = Models.Accounts.create_user(%{display_name: "bill", password: "password", email: "email@email.com"})
      iex> {:ok, requesting_user} = Models.Accounts.create_user(%{display_name: "tom", password: "password", email: "tom@email.com"})
      iex> {:ok, user_id_not_involved} = Models.Accounts.create_user(%{display_name: "toms2", password: "password", email: "tom@em3ail.com"})
      iex> {:ok, _} = Models.Accounts.send_friend_request(user, requesting_user)
      iex> Models.Accounts.accept_friend_request(requesting_user, user)
      {:error, "friend request sent from this user"}
      iex> Models.Accounts.accept_friend_request(user_not_involved, requesting_user)
      {:error, "no friend request exists between these users"}
      iex> {:ok, friendship} = Models.Accounts.accept_friend_request(user, requesting_user)
      iex> friendship.is_accepted
      true

  """
  def accept_friend_request(user, params) do
    with {:ok, {user_friendship, friend_friendship}} <- find_pending_friendship(user, params),
         :ok <- verify_unaccepted_friendship(user_friendship),
         true <- user_friendship.user_id === user.id,
         false <- user_friendship.is_sender,
         {:ok, %{friendship_user: user}} <- accept_friendship(user_friendship, friend_friendship) do
      {:ok, user}
    else
      true -> {:error, "You cannot accept a friendship you sent"}
      false -> {:error, "You don't own this friendship"}
      e -> e
    end
  end

  def set_primary_gamer_tag(user, friendship_id, gamer_tag_id) do
    with {:ok, {user_friendship, _}} <- get_friendship_tuple(user, %{friendship_id: friendship_id}) do
      user_friendship
        |> Friendship.changeset(%{primary_gamer_tag_id: gamer_tag_id})
        |> Repo.update
    end
  end

  def check_gamer_tag_belongs_to(user, gamer_tag_id) do
    has_gamer_tag? = user
      |> Repo.preload(:gamer_tags)
      |> Map.get(:gamer_tags, [])
      |> Enum.any?(&(&1.id === gamer_tag_id))

    if has_gamer_tag?, do: :ok, else: {:error, "#{user.display_name} doesn't own gamer tag id #{gamer_tag_id}"}
  end

  def get_friend(user_id, friend_id) do
    if user_id === friend_id do
      {:error, "You cannot use yourself as friend"}
    else
      get_user(friend_id)
    end
  end

  defp verify_unaccepted_friendship(%{is_accepted: true}), do: {:error, "Friendship is already accepted"}
  defp verify_unaccepted_friendship(%{is_accepted: false}), do: :ok

  defp find_pending_friendship(user, %{friend_user_id: friend_id}) do
    with {:ok, friend} <- get_friend(user.id, friend_id) do
      case Friendship.get_user_any_friendship_query(user.id, friend_id) |> Repo.all do
        [] -> {:error, "No friendship found between you and #{friend.display_name}"}
        [%{is_accepted: true}, %{is_accepted: true}] -> {:error, "You are already friends with #{friend.display_name}"}
        friendships when is_list(friendships) -> {:ok, sort_friendships_by_user_friend(friendships, user.id, friend.id)}
      end
    end
  end

  defp find_pending_friendship(user, %{friendship_id: friendship_id}) do
    with {:ok, {user_friendship, friend_friendship}} <- get_friendship_tuple(user, %{friendship_id: friendship_id}) do
      {:ok, {user_friendship, friend_friendship}}
    end
  end

  defp sort_friendships_by_user_friend([], _, _), do: nil
  defp sort_friendships_by_user_friend(friendships, user_id, friend_id) do
    res = Enum.group_by(friendships, &(&1.user_id))
    user = res |> Map.get(user_id) |> List.first
    friend = res |> Map.get(friend_id) |> List.first

    {user, friend}
  end

  def reject_friend_request(user, params) do
    with {:ok, {user_friendship, friend_friendship}} <- get_friendship_tuple(user, params),
         true <- !user_friendship.is_accepted,
         false <- user_friendship.is_sender,
         {:ok, _} <- delete_friend(user_friendship, friend_friendship) do
      {:ok, %{rejected: true}}
    else
      true -> {:error, "Cannot reject an invite that you sent"}
      false -> {:error, "Cannot reject an invite that has already been accepted"}
      e -> e
    end
  end

  def create_user_friend_group(user, params) do
    %UserFriendGroup{user: user}
      |> UserFriendGroup.changeset(params)
      |> Repo.insert
  end

  def delete_friend_group(user, friend_group_id) do
    with {:ok, friend_group} <- get_user_friend_group(friend_group_id),
         :ok <- check_is_owned_friend_group(user, friend_group),
         {:ok, _} <- Repo.delete(friend_group) do
      {:ok, %{deleted: true}}
    end
  end

  def update_friend_group(user, id, params) do
    with {:ok, user_friend_group} <- get_user_friend_group(id, :user),
         :ok <- check_is_owned_friend_group(user, user_friend_group) do
      UserFriendGroup.changeset(user_friend_group, params)
        |> Models.Repo.update
    end
  end

  def add_friendship_to_friend_group(user, id, friendship_id) do
    with {:ok, friend_group} <- get_user_friend_group(id, [:friendships, :user]),
         :ok <- check_is_owned_friend_group(user, friend_group),
         {:ok, {friendship, _}} <- get_friendship_tuple(user, %{friendship_id: friendship_id}) do
      UserFriendGroup.changeset(friend_group, %{
        friendships: friend_group.friendships ++ [friendship]
      }) |> Repo.update
    end
  end

  def remove_friendship_from_friend_group(user, friend_group_id, friendship_id) do
    with {:ok, friend_group} <- get_user_friend_group(friend_group_id, :friendships),
         :ok <- check_is_owned_friend_group(user, friend_group) do
      case Enum.find friend_group.friendships, &(&1.id === friendship_id) do
        nil -> {:error, "No friendship with id #{friendship_id} in #{friend_group.name}"}
        _ -> delete_user_friend_group_friendship(friend_group, friendship_id)
      end
    end
  end

  def delete_user_friend_group_friendship(friend_group, friendship_id) do
    res = Ecto.Query.where(UserFriendGroupFriendship, [ufgf],
      ufgf.user_friend_group_id == ^friend_group.id and ufgf.friendship_id == ^friendship_id
    ) |> Repo.delete_all

    case res do
      {1, _} ->
        res = Map.update!(
          friend_group,
          :friendships,
          &remove_friend_from_friendships(&1, friendship_id)
        )

        {:ok, res}
      _ -> {:error, "No results deleted"}
    end
  end

  defp remove_friend_from_friendships(friendships, id), do: Enum.reject(friendships, &(&1.id === id))

  def destroy_friend_group(friend_group_id) do
    case Repo.get(UserFriendGroup, friend_group_id) do
      nil -> {:error, "No friend group exists with id: #{friend_group_id}"}
      friend_group -> Repo.delete(friend_group)
    end
  end

  @doc """
  Removes a friend

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, user} = Models.Accounts.create_user(%{display_name: "bill", password: "password", email: "email@email.com"})
      iex> {:ok, requesting_user} = Models.Accounts.create_user(%{display_name: "tom", password: "password", email: "tom@email.com"})
      iex> {:ok, _} = Models.Accounts.send_friend_request(user, requesting_user)
      iex> {:ok, friendship} = Models.Accounts.accept_friend_request(user, requesting_user)
      iex> {:ok, {returned_friend, returned_user}} = Models.Accounts.remove_friend(user.id, friend_id)
      iex> user.id == returned_user.id
      true
      iex> requesting_user.id == returned_friend.id
      true

  """
  def remove_friend(user, params) do
    with {:ok, {user_friendship, friend_friendship}} <- get_friendship_tuple(user, params),
         true <- user_friendship.is_accepted,
         {:ok, _} <- delete_friend(user_friendship, friend_friendship) do
      {:ok, %{removed: true}}
    else
      false -> {:error, "You cannot remove a friend who has not accepted your request"}
      e -> e
    end
  end

  def delete_friend(user_friendship, friend_friendship) do
    res = [user_friendship.id, friend_friendship.id]
      |> Friendship.find_frindship_by_id_query()
      |> Repo.delete_all

    cond do
      {2, _} = res -> {:ok, {user_friendship, friend_friendship}}
      true -> res
    end
  end

  def get_followed_user(user, followed_id) do
    with {:ok, followed} <- get_user(followed_id) do
      case Repo.get_by(Follower, user_id: followed_id, follower_id: user.id) do
        nil -> {:error, "You are not following #{followed.displayName}"}
        follower_schema -> {:ok, follower_schema}
      end
    end
  end

  def get_user_any_friendship(user_1_id, user_2_id) do
    Friendship.get_user_any_friendship_query(user_1_id, user_2_id)
     |> Repo.all
     |> sort_friendships_by_user_friend(user_1_id, user_2_id)
  end

  def find_user_friendship(user_1_id, user_2_id) do
    Friendship.find_friendship_query(user_1_id, user_2_id)
     |> Repo.one
  end

  def get_users_friendships(users, params \\ []) do
    users
      |> Utility.pluck(:id)
      |> Friendship.get_users_friendships_query
      |> Friendship.reduce_params_to_query(params, users)
      |> Repo.all
  end

  def get_friendship(friendship_id) do
    case Repo.get(Friendship, friendship_id) do
      nil -> {:error, "No friendship with that ID"}
      friendship -> {:ok, friendship}
    end
  end

  def get_friendship_tuple(user, %{friend_user_id: friend_id}) do
    with {:ok, friend} <- get_friend(user.id, friend_id) do
      case get_user_any_friendship(user.id, friend_id) do
        nil -> {:error, "No friendship found between you and #{friend.display_name}"}
        friendships -> {:ok, friendships}
      end
    end
  end

  def get_friendship_tuple(user, %{friendship_id: friendship_id}) do
    with {:ok, user_friendship} <- get_friendship(friendship_id),
         friendship <- find_user_friendship(user_friendship.friend_id, user_friendship.user_id),
         true <- user.id === friendship.friend_id or friendship.user_id === user.id do
      friend_id = if user_friendship.user_id === user.id, do: user_friendship.friend_id, else: user_friendship.user_id

      {:ok, sort_friendships_by_user_friend([user_friendship, friendship], user.id, friend_id)}
    else
      false -> {:error, "Friendship does not belong to #{user.display_name}"}
      e -> e
    end
  end

  defp check_is_owned_friend_group(user, friend_group) do
    if friend_group.user_id === user.id do
      :ok
    else
      {:error, "You don't own this friend group"}
    end
  end

  defp accept_friendship(user_friendship, friend_friendship) do
    Friendship.accept_friendship_query(user_friendship, friend_friendship)
      |> Repo.transaction
  end

  defp handle_send_friendship_error(user, {user_friendship, _}) do
    friend_id = user_friendship.friend_id
    is_sender? = user_friendship.is_sender
    is_accepted? = user_friendship.is_accepted

    message = cond do
      user.id === friend_id -> "You cannot request a friendship with yourself"
      is_accepted? -> "#{Repo.preload(user_friendship, :friend).friend.display_name} is already your friend"
      !is_accepted? and is_sender? -> "You have already requested friendship from #{Repo.preload(user_friendship, :friend).friend.display_name}"
      !is_accepted? and !is_sender? -> "You already have an incoming friend request from #{user.display_name}"
    end

    {:error, message}
  end
end
