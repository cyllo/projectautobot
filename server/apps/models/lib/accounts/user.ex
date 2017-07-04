defmodule Models.Accounts.User do
  alias Models.Accounts.{User, Follower, Friendship}
  alias Models.Game
  alias Models.Game.GamerTag
  alias Comeonin.Pbkdf2

  use Models.Model

  schema "users" do
    field :username, :string
    field :email, :string
    field :battle_net_id, :integer
    field :battle_net_tag, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    field :is_admin, :boolean, default: false
    has_many :friends, Friendship
    has_many :gamer_tags, GamerTag
    many_to_many :followers, User, join_through: "followers",
                                   join_keys: [user_id: :id, follower_id: :id],
                                   unique: true

    many_to_many :gamer_tags_following, GamerTag, join_through: "gamer_tag_user_followers",
                                                  join_keys: [user_id: :id, gamer_tag_id: :id],
                                                  on_delete: :delete_all,
                                                  unique: true

    timestamps()
  end

  @required_fields [:username, :email]
  @allowed_fields Enum.concat(@required_fields, [:password, :battle_net_id, :battle_net_tag])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%User{} = user, params \\ %{}) do
    user
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:username, name: :users_username_index)
      |> unique_constraint(:email, name: :users_email_index)
      |> unique_constraint(:battle_net_id, name: :users_battle_net_id_index,
                                           message: "There is already an account associated with that battle net id")
      |> unique_constraint(:battle_net_tag, name: :users_battle_net_tag_index,
                                            message: "There is already an account associated with that battle net tag")
      |> validate_length(:password, min: 3, max: 100)
      |> put_gamer_tags_following
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

  defp put_gamer_tags_following(changeset) do
    gamer_tags_following_ids = changeset.params["gamer_tags_following"]

    if gamer_tags_following_ids do
      import IEx
      IEx.pry
      changeset
        |> put_assoc(:gamer_tags_following, Game.get_gamer_tags_by_ids(gamer_tags_following_ids))
    else
      changeset
    end
  end

  defp put_password(changeset) do
    password = changeset.params["password"]

    if (password && changeset.valid?) do
      password_hash = Pbkdf2.hashpwsalt(password)

      put_change(changeset, :password_hash, password_hash)
    else
      changeset
    end
  end
end
