defmodule Models.Accounts do
  alias Models.Accounts.{User, Follower}
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
    with follower <- build_assoc(user, :followers, follower_id: user_follower.id),
         {:ok, _} <- follower |> Follower.changeset |> Repo.insert do

      {:ok, Repo.preload(user, :followers)}
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

  def find_user_by_email_or_display_name(email) do
    case from(User, where: [display_name: ^email], or_where: [email: ^email]) |> Repo.one do
      nil -> {:error, "no user found with email: #{email}"}
      user -> {:ok, user}
    end
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
  def send_friend_request(requested_user, requesting_user) do

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
  def accept_friend_request(user_id, requesting_user_id) do

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
  def remove_friend(user_id, friend_id) do

  end
end
