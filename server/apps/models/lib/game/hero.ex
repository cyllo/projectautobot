defmodule Models.Game.Hero do
  use Models.Model
  alias Models.Game.Hero

  schema "heroes" do
    field :name, :string
    field :code, :string

    timestamps(type: :utc_datetime)
  end

  @required_fields [:name, :code]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Hero{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:name)
      |> unique_constraint(:code)
  end

  def create_changeset(params), do: changeset(%Hero{}, params)
end
