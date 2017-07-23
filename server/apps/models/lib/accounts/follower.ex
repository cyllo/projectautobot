defmodule Models.Accounts.Follower do
  alias Models.Accounts.User
  use Models.Model

  @primary_key false

  schema "followers" do
    belongs_to :follower, User
    belongs_to :user, User

    timestamps(type: :utc_datetime)
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
      |> cast(params, [])
      |> unique_constraint(:user, name: :followers_pkey, message: "User is already following #{struct.follower.display_name}")
      |> validate_follower
  end

  defp validate_follower(changeset) do
    if (changeset.data.follower.id === changeset.data.user.id) do
      add_error(changeset, :follower, "You cannot follow yourself")
    else
      changeset
    end
  end
end

