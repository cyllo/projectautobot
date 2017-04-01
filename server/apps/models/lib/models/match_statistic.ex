defmodule Models.MatchStatistics do
  use Models.Model

  schema "match_statistics" do
    field :name, :string
    belongs_to :battle_tag, Models.BattleTag

    timestamps()
  end

  @required_fields [:name, :battle_tag_id]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> cast_assoc(:battle_tag)
  end
end
