defmodule Models.Accounts do
  alias Models.Accounts.User
  alias Models.Repo
  use Models.Model

  @doc """
  Creates a user from params

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, _} = Models.Accounts.create_user(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:error, errors} = Models.Accounts.create_user(%{username: "test", password: "password", email: "eamil2@g.ca"})
      iex> {:username, {"has already been taken", []}} in errors
      true
      iex> {:error, errors} = Models.Accounts.create_user(%{username: "tobias", password: "password", email: "eamil@g.ca"})
      iex> {:email, {"has already been taken", []}} in errors
      true

  """
  def create_user(params) do
    changeset = User.create_changeset params

    if (changeset.valid?) do
      {status, res} = Repo.insert(changeset)

      case status do
        :ok -> {:ok, res}
        :error -> {:error, res.errors}
      end
    else
      {:error, changeset.errors}
    end
  end

  @doc """
  Creates a user from params

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, user} = Models.Accounts.create_user(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:ok, new_user} = Models.Accounts.create_user(%{username: "Tester", password: "password", email: "email@g.ca"})
      iex> {:ok, user} = Models.Accounts.create_user_follower user, new_user.id
      iex> length(user.followers)
      1


  """
  def create_user_follower(user, follower_id) do
    follower = build_assoc(user, :followers, follower_id: follower_id)

    with {:ok, _} <- Repo.insert follower do
      {:ok, Repo.preload(user, :followers)}
    end
  end

  @doc """
  Finds user by username

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, _} = Models.Accounts.create_user(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:ok, user} = Models.Accounts.find_user_by_username("test")
      iex> user.username
      "Test"

      iex> {:error, errors} = Models.Accounts.find_user_by_username("test")
      iex> {:username, "not found"} in errors
      true

  """
  def find_user_by_username(username) do
    res = Repo.get_by User, username: username

    if (res), do: {:ok, res}, else: {:error, [username: "not found"]}
  end

  @doc """
  Finds user by `user_name` and verifies `password`

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:error, errors} = Models.Accounts.find_user_and_confirm_password("test", "pass")
      iex> {:username, "not found"} in errors
      true
      iex> Models.Accounts.create_user(%{username: "bill", password: "password", email: "email@email.com"})
      iex> {:error, errors} = Models.Accounts.find_user_and_confirm_password("bill", "pass")
      iex> {:password, "is not correct"} in errors
      true
      iex> {:ok, user} = Models.Accounts.find_user_and_confirm_password("bill", "password")
      iex> user.username
      "bill"

  """
  def find_user_and_confirm_password(username, password) do
    with {:ok, user} <- find_user_by_username username do
      if User.has_correct_pw?(user, password), do: {:ok, user}, else: {:error, [password: "is not correct"]}
    end
  end

  @doc """
  sends a friend request to a user

  Returns `{:ok, friendship}` or `{:error, error}`.

  ## Examples

      iex> {:ok, %{id: friend_id}} = Models.Accounts.create_user(%{username: "bill", password: "password", email: "email@email.com"})
      iex> {:ok, %{id: requesting_user_id}} = Models.Accounts.create_user(%{username: "tom", password: "password", email: "tom@email.com"})
      iex> {:ok, _} = Models.Accounts.send_friend_request(friend_id, requesting_user_id)
      iex> Models.Accounts.send_friend_request(friend_id, requesting_user_id)
      {:error, {:friend_id, "already sent"}}
      iex> Models.Accounts.send_friend_request(requesting_user_id, friend_id)
      {:error, {:friend_id, "already sent"}}
      iex> {:ok, friendship} = Models.Accounts.accept_friend_request(requesting_user_id, friend_id)
      iex> friendship.is_accepted
      true

  """
  def send_friend_request(user_id, requesting_user_id) do

  end

  @doc """
  Accepts a friend request

  Returns `{:ok, friendship}` or `{:error, error}`.

  ## Examples

      iex> {:ok, %{id: user_id}} = Models.Accounts.create_user(%{username: "bill", password: "password", email: "email@email.com"})
      iex> {:ok, %{id: requesting_user_id}} = Models.Accounts.create_user(%{username: "tom", password: "password", email: "tom@email.com"})
      iex> {:ok, %{id: user_id_not_involved}} = Models.Accounts.create_user(%{username: "toms2", password: "password", email: "tom@em3ail.com"})
      iex> {:ok, _} = Models.Accounts.send_friend_request(user_id, requesting_user_id)
      iex> Models.Accounts.accept_friend_request(requesting_user_id, user_id)
      {:error, {:user_id, "request sent from this user"}}
      iex> Models.Accounts.accept_friend_request(user_id_not_involved, requesting_user_id)
      {:error, {:user_id, "no request exists"}}
      iex> {:ok, friendship} = Models.Accounts.accept_friend_request(user_id, requesting_user_id)
      iex> friendship.is_accepted
      true

  """
  def accept_friend_request(user_id, requesting_user_id) do

  end
end
