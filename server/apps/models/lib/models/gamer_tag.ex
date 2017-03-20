defmodule Models.BattleTag do
  use Models.Model

  schema "gamer_tags" do
    field :tag, :string
    field :overwatch_name, :string
    field :platform, :string, null: false
    field :region, :string
    has_one :user, Models.User

    timestamps()
  end

  @required_fields [:tag, :user_id, :platform]
  @allowed_fields Enum.concat(@required_fields, [:region, :overwatch_name])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> cast_assoc(:user)
  end
end
