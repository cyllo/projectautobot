defmodule Models.Accounts do
  alias Models.Accounts.{User, Follower}
  alias Models.{Repo, Model}
  use Models.Model

  Model.create_model_methods(User)

  @doc """
  Creates a user from params

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, _} = Models.Accounts.create_user(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:error, %{errors: errors}} = Models.Accounts.create_user(%{username: "test", password: "password", email: "eamil2@g.ca"})
      iex> {:username, {"has already been taken", []}} in errors
      true
      iex> {:error, %{errors: errors}} = Models.Accounts.create_user(%{username: "tobias", password: "password", email: "eamil@g.ca"})
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

      iex> {:ok, user} = Models.Accounts.create_user(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:ok, new_user} = Models.Accounts.create_user(%{username: "Tester", password: "password", email: "email@g.ca"})
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
      iex> Models.Accounts.create_user(%{username: "bill", password: "password", email: "email@email.com"})
      iex> {:error, error} = Models.Accounts.find_user_and_confirm_password("bill", "pass")
      iex> "password is not correct" === error
      true
      iex> {:ok, user} = Models.Accounts.find_user_and_confirm_password("bill", "password")
      iex> user.username
      "bill"
      iex> {:ok, user} = Models.Accounts.find_user_and_confirm_password("email@email.com", "password")
      iex> user.username
      "bill"

  """
  def find_user_and_confirm_password(identifier, password) do
    with {:ok, user} <- find_user_by_email_or_username(identifier) do
      check_user_password(user, password)
    end
  end

  def find_user_by_email_or_username(identifier) do
    case from(User, where: [username: ^identifier], or_where: [email: ^identifier]) |> Repo.one do
      nil -> {:error, "no user found with identifier: #{identifier}"}
      user -> {:ok, user}
    end
  end

  defp check_user_password(user, password) do
    if User.has_correct_pw?(user, password) do
      {:ok, user}
    else
      {:error, "password is not correct"}
    end
  end

  @doc """
  sends a friend request to a user

  Returns `{:ok, friendship}` or `{:error, error}`.

  ## Examples

      iex> {:ok, friend} = Models.Accounts.create_user(%{username: "bill", password: "password", email: "email@email.com"})
      iex> {:ok, user} = Models.Accounts.create_user(%{username: "tom", password: "password", email: "tom@email.com"})
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

      iex> {:ok, user} = Models.Accounts.create_user(%{username: "bill", password: "password", email: "email@email.com"})
      iex> {:ok, requesting_user} = Models.Accounts.create_user(%{username: "tom", password: "password", email: "tom@email.com"})
      iex> {:ok, user_id_not_involved} = Models.Accounts.create_user(%{username: "toms2", password: "password", email: "tom@em3ail.com"})
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
end
