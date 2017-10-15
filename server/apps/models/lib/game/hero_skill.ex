defmodule Models.Game.HeroSkill do
  use Models.Model

  alias Models.Game.{Hero, HeroSkill}

  schema "hero_skills" do
    field :name, :string
    field :description, :string
    field :icon_url, :string
    belongs_to :hero, Hero
  end

  @required_fields [:name, :description, :icon_url, :hero_id]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%HeroSkill{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:name)
      |> unique_constraint(:description)
      |> unique_constraint(:icon_url)
  end

  def create_changeset(params), do: changeset(%HeroSkill{}, params)
end
