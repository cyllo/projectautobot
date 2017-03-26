defmodule Models.Accounts.Follower do
  alias Models.Accounts.User
  use Models.Model

  @primary_key false

  schema "followers" do
    belongs_to :follower, User
    belongs_to :user, User

    timestamps()
  end

  @required_fields [:follwer_id, :user_id]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> cast_assoc(:follower)
      |> cast_assoc(:user)
  end
end

