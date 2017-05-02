defmodule Models.Accounts.User do
  alias Models.Accounts.{User, Follower, Friendship}
  alias Models.Game.GamerTag
  alias Comeonin.Pbkdf2

  use Models.Model

  schema "users" do
    field :username, :string
    field :email, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    has_many :followers, Follower
    has_many :friends, Friendship
    has_many :gamer_tags, GamerTag

    timestamps()
  end

  @required_fields [:username, :email, :password]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%User{} = user, params \\ %{}) do
    user
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:username, name: :users_username_index)
      |> unique_constraint(:email, name: :users_email_index)
      |> validate_length(:password, min: 3, max: 100)
      |> put_password
  end

  def create_changeset(params), do: changeset(%User{}, params)

  @doc """
  Checks if a user's password is correct

  Returns boolean true|false

  ## Examples

      iex> {:ok, user} = Models.Accounts.create_user(%{username: "Test", password: "password", email: "eamil@g.ca"})
      iex> Models.Accounts.User.has_correct_pw?(user, "password123")
      false
      iex> Models.Accounts.User.has_correct_pw?(user, "password")
      true

  """
  def has_correct_pw?(%User{} = user, password), do: Pbkdf2.checkpw(password, user.password_hash)

  defp put_password(changeset) do
    if (changeset.valid?) do
      password_hash = Pbkdf2.hashpwsalt(changeset.params["password"])

      put_change(changeset, :password_hash, password_hash)
    else
      changeset
    end
  end
end
