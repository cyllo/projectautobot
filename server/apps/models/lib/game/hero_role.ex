defmodule Models.Game.HeroRole do
  use Models.Model

  alias Models.Game.HeroRole

  schema "hero_roles" do
    field :name, :string
    field :svg_url, :string
  end

  @required_fields [:name, :svg_url]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%HeroRole{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:name)
      |> unique_constraint(:svg_url)
  end

  def create_changeset(params), do: changeset(%HeroRole{}, params)
end
