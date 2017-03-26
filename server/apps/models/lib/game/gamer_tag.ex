defmodule Models.Game.GamerTag do
  use Models.Model

  schema "gamer_tags" do
    field :tag, :string
    field :overwatch_name, :string
    field :portrait_url, :string

    field :competitive_level, :integer
    field :competitive_rank_url, :string

    field :region, :string
    field :platform, :string, null: false

    field :level, :integer
    field :rank_url, :integer

    field :total_games_won, :integer

    has_one :user, Models.Accounts.User
    has_many :snapshot_statistics, Models.Statistics.Snapshot

    timestamps()
  end

  @required_fields [:tag]
  @allowed_fields Enum.concat(@required_fields, [:overwatch_name])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:tag)
      |> cast_assoc(:user)
  end
end
