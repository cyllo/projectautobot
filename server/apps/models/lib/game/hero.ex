defmodule Models.Game.Hero do
  use Models.Model

  schema "heroes" do
    field :name, :string
    field :code, :string

    timestamps()
  end

  @required_fields [:name]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
  end
end
