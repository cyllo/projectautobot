defmodule Models.Accounts.User do
  alias Models.Accounts.{UserFriendGroup, User, Friendship}
  alias Models.Game
  alias Models.Game.GamerTag
  alias Comeonin.Pbkdf2

  use Models.Model

  schema "users" do
    field :display_name, :string
    field :email, :string
    field :battle_net_id, :integer
    field :battle_net_tag, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    field :is_admin, :boolean, default: false
    belongs_to :primary_gamer_tag, GamerTag
    has_many :friendships, Friendship
    has_many :gamer_tags, GamerTag
    has_many :friend_groups, UserFriendGroup
    many_to_many :following, User, join_through: "followers",
                                   join_keys: [follower_id: :id, user_id: :id],
                                   unique: true
    many_to_many :followers, User, join_through: "followers",
                                   join_keys: [user_id: :id, follower_id: :id],
                                   unique: true

    many_to_many :gamer_tags_following, GamerTag, join_through: "gamer_tag_user_followers",
                                                  join_keys: [user_id: :id, gamer_tag_id: :id],
                                                  on_delete: :delete_all,
                                                  unique: true

    timestamps(type: :utc_datetime)
  end

  @required_fields [:display_name, :email]
  @allowed_fields Enum.concat(@required_fields, [:primary_gamer_tag_id, :password, :battle_net_id, :battle_net_tag])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%User{} = user, params \\ %{}) do
    user
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> foreign_key_constraint(:primary_gamer_tag_id, message: "primary gamer tag id doesn't exist")
      |> unique_constraint(:display_name, name: :users_display_name_index)
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
  def get_user_fields(user), do: Map.take(user, User.__schema__(:fields))

  @doc """
  Checks if a user's password is correct

  Returns boolean true|false

  ## Examples

      iex> {:ok, user} = Models.Accounts.create_user(%{display_name: "Test", password: "password", email: "eamil@g.ca"})
      iex> Models.Accounts.User.has_correct_pw?(user, "password123")
      false
      iex> Models.Accounts.User.has_correct_pw?(user, "password")
      true

  """
  def has_correct_pw?(%User{} = user, password), do: Pbkdf2.checkpw(password, user.password_hash)

  def search_query(identifier) do
    search_string = "%#{identifier}%"

    from(u in User, where: ilike(u.display_name, ^search_string),
                    or_where: ilike(u.email, ^search_string))
  end

  defp put_gamer_tags_following(changeset) do
    gamer_tags_following_ids = changeset.params["gamer_tags_following"]

    if gamer_tags_following_ids do
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
