defmodule Models.User do
  alias Models.{User, Repo, Follower}
  use Models.Model

  schema "users" do
    field :username, :string
    field :email, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    has_many :followers, Follower

    timestamps()
  end

  @required_fields [:username, :email, :password]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:username, name: :users_username_index)
      |> unique_constraint(:email, name: :users_email_index)
      |> validate_length(:password, min: 3, max: 100)
      |> put_password
  end

  @doc """
  Creates a user from params

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, _} = Models.User.create(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:error, errors} = Models.User.create(%{username: "test", password: "password", email: "eamil2@g.ca"})
      iex> {:username, {"has already been taken", []}} in errors
      true
      iex> {:error, errors} = Models.User.create(%{username: "tobias", password: "password", email: "eamil@g.ca"})
      iex> {:email, {"has already been taken", []}} in errors
      true

  """
  def create(params) do
    changeset = changeset %User{}, params

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

      iex> {:ok, user} = Models.User.create(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:ok, new_user} = Models.User.create(%{username: "Tester", password: "password", email: "email@g.ca"})
      iex> {:ok, user} = Models.User.create_follower user, new_user.id
      iex> length(user.followers)
      1


  """
  def create_follower(user, follower_id) do
    follower = build_assoc(user, :followers, follower_id: follower_id)

    with {:ok, _} <- Repo.insert follower do
      {:ok, Repo.preload(user, :followers)}
    end
  end

  @doc """
  Finds user by username

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:ok, _} = Models.User.create(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> {:ok, user} = Models.User.find_by_username("test")
      iex> user.username
      "Test"

      iex> {:error, errors} = Models.User.find_by_username("test")
      iex> {:username, "not found"} in errors
      true

  """
  def find_by_username(username) do
    res = Repo.get_by User, username: username

    if (res), do: {:ok, res}, else: {:error, [username: "not found"]}
  end

  @doc """
  Finds user by `user_name` and verifies `password`

  Returns `{:ok, user}` or `{:error, error}`.

  ## Examples

      iex> {:error, errors} = Models.User.find_and_confirm_password("test", "pass")
      iex> {:username, "not found"} in errors
      true
      iex> Models.User.create(%{username: "bill", password: "password", email: "email@email.com"})
      iex> {:error, errors} = Models.User.find_and_confirm_password("bill", "pass")
      iex> {:password, "is not correct"} in errors
      true
      iex> {:ok, user} = Models.User.find_and_confirm_password("bill", "password")
      iex> user.username
      "bill"

  """
  def find_and_confirm_password(username, password) do
    with {:ok, user} <- find_by_username username do
      if has_correct_pw?(user, password), do: {:ok, user}, else: {:error, [password: "is not correct"]}
    end
  end

  defp has_correct_pw?(user, password), do: Comeonin.Pbkdf2.checkpw(password, user.password_hash)
  defp put_password(changeset) do
    password_hash = Comeonin.Pbkdf2.hashpwsalt(changeset.params["password"])

    put_change(changeset, :password_hash, password_hash)
  end
end
