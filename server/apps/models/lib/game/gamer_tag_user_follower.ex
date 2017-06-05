defmodule Models.Game.GamerTagUserFollower do
  use Models.Model
  alias Models.Game.{GamerTag, GamerTagUserFollower}
  alias Models.Accounts.User

  @primary_key false

  schema "gamer_tag_user_followers" do
    belongs_to :gamer_tag, GamerTag
    belongs_to :user, User
  end

  @required_fields [:gamer_tag_id, :user_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%GamerTagUserFollower{} = struct, params \\ %{}) do
    struct
      |> cast(params, @required_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:gamer_tag_id, name: :gamer_tag_user_followers_pkey,
                                          message: "#{params.gamer_tag_id} is already being followed by user_id #{params.user_id}")
  end

  def create_changeset(params), do: changeset(%GamerTagUserFollower{}, params)
end
