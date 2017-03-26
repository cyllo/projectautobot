defmodule Models.Statistics.Snapshot do
  use Models.Model

  schema "snapshot_statistics" do
    belongs_to :gamer_tag, Models.Game.GamerTag

    timestamps()
  end

  @required_fields [:battle_tag_id]
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
