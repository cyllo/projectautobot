defmodule Models.Game.ConnectedGamerTag do
  use Models.Model
  alias Models.Game.{GamerTag, ConnectedGamerTag}

  @primary_key false

  schema "connected_gamer_tags" do
    belongs_to :gamer_tag1, GamerTag
    belongs_to :gamer_tag2, GamerTag
  end

  @required_fields [:gamer_tag1_id, :gamer_tag2_id]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%ConnectedGamerTag{} = struct, params \\ %{}) do
    struct
      |> cast(params, @required_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:gamer_tag1_id, name: :connected_gamer_tags_pkey,
                                           message: "#{params.gamer_tag1_id} is already connected to gamer_tag_id #{params.gamer_tag2_id}")
  end

  def create_changeset(params), do: changeset(%ConnectedGamerTag{}, params)
end
