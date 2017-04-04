defmodule Models.Statistics.HeroSpecific do
  use Models.Model
  alias Models.Statistics.HeroSpecific

  schema "hero_specific_statistics" do
    field :stats, :map
    belongs_to :hero, Models.Game.Hero
  end

  @required_fields [:stats, :hero_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%HeroSpecific{} = struct, params \\ %{}) do
    struct
      |> cast(params, @required_fields)
      |> validate_required(@required_fields)
      |> cast_assoc(:hero)
  end

  def create_changeset(params), do: changeset(%HeroSpecific{}, params)
end
