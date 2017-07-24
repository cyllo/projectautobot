defmodule Models.Accounts do
  alias Models.Accounts.{User, Follower, Friendship}
  alias Models.{Game, Repo, Model}
  alias Models.Game.GamerTagUserFollower
  use Models.Model

  @incorrect_password_message "password is not correct"

  Model.create_model_methods(User)

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
      iex> {:ok, user} = Models.Accounts.create_user_follower user, new_user
      iex> length(user.followers)
      1


  """
  def create_user_follower(user, user_follower) do
    with {:ok, _} <- %Follower{user: user, follower: user_follower} |> Follower.changeset |> Repo.insert do
      {:ok, Repo.preload(user, :followers)}
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
    with nil <- get_user_friendship(user.id, future_friend_id),
         {:ok, friendship} <- Repo.insert(%Friendship{user: user, friend_id: future_friend_id}) do
      {:ok, Repo.preload(friendship, [:user, :friend])}
    else
      %Friendship{} = friendship -> handle_send_friendship_error(user, friendship)
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
    with {:ok, friendship} <- get_friendship(user, params) do
      if friendship.is_accepted do
        {:error, "Friendship is already accepted"}
      else
        update_friendship(friendship, %{is_accepted: true})
      end
    end
  end

  def reject_friend_request(user, params) do
    with {:ok, _} <- delete_friendship(user, params), do: {:ok, %{rejected: true}}
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
    with {:ok, _} <- delete_friendship(user, params), do: {:ok, %{removed: true}}
  end

  def get_followed_user(user, followed_id) do
    with {:ok, followed} <- get_user(followed_id) do
      case Repo.get_by(Follower, user_id: followed_id, follower_id: user.id) do
        nil -> {:error, "You are not following #{followed.displayName}"}
        follower_schema -> {:ok, follower_schema}
      end
    end
  end

  def get_user_friendship(user_1_id, user_2_id) do
    User.get_user_friendship_query(user_1_id, user_2_id)
     |> Repo.one
  end

  def get_users_friendships(users, params \\ []) do
    users
      |> Utility.pluck(:id)
      |> User.get_users_friendships_query
      |> Friendship.reduce_params_to_query(params, users)
      |> Repo.all
  end

  defp get_friendship(user, %{friend_user_id: friend_id}) do
    with {:ok, friend} <- get_user(friend_id) do
      case get_user_friendship(user.id, friend_id) do
        nil -> {:error, "No friendship found between you and #{friend.display_name}"}
        friendship -> {:ok, friendship}
      end
    else
      {:error, _} -> {:error, "Cannot add a user that doesn't exist"}
    end
  end

  defp get_friendship(_user, %{friendship_id: friendship_id}) do
    case Repo.get(Friendship, friendship_id) do
      nil -> {:error, "No friendship with that ID"}
      friendship -> {:ok, friendship}
    end
  end

  defp update_friendship(friendship, params), do: Friendship.changeset(friendship, params) |> Repo.update
  defp delete_friendship(user, params) do
    with {:ok, friendship} <- get_friendship(user, params) do
      Repo.delete(friendship)
    end
  end

  defp handle_send_friendship_error(user, friendship) do
    friend = friendship.friend
    is_friendship_user? = user.id === friendship.user_id
    is_friendship_friend? = user.id === friendship.friend_id
    is_accepted? = friendship.is_accepted

    message = cond do
      is_friendship_user? and is_friendship_friend? -> "You cannot request a friendship with yourself"
      !is_accepted? and is_friendship_user? -> "You have already requested friendship from #{friend.display_name}"
      !is_accepted? and is_friendship_friend? -> "You already have an incoming friend request from #{user.display_name}"
      is_accepted? and is_friendship_user? ->
        display_name = if is_friendship_user?, do: user.display_name, else: friend.display_name
        "#{display_name} is already your friend"
    end

    {:error, message}
  end
end
