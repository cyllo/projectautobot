defmodule Models.Statistics.Snapshots.SnapshotStatistic do
  use Models.Model
  alias Models.Statistics.Snapshots.SnapshotStatistic

  schema "snapshot_statistics" do
    field :is_competitive, :boolean
    belongs_to :gamer_tag, Models.Game.GamerTag
    has_many :hero_snapshot_statistics, Models.Statistics.Snapshots.HeroStatistic
    has_one :all_heroes_snapshot_statistics, Models.Statistics.Snapshots.AllHeroesStatistic

    timestamps()
  end

  @required_fields [:gamer_tag_id]
  @allowed_fields Enum.concat(@required_fields, [:is_competitive])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%SnapshotStatistic{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> cast_assoc(:gamer_tag)
  end

  def create_changeset(params), do: changeset(%SnapshotStatistic{}, params)
end
