defmodule Models.Accounts.Friendship do
  use Models.Model
  alias Models.Accounts.User

  schema "friendships" do
    field :is_accepted, :boolean, default: false
    belongs_to :user, User
    belongs_to :friend, User

    timestamps()
  end

  @required_fields [:friend_id, :user_id, :is_accepted]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      # |> unique_constraint(:user_id, name: :followers_pkey, message: "#{struct.user_id} is already following #{struct.follower_id}")
      # |> cast_assoc(:follower)
      # |> cast_assoc(:user)
  end
end
