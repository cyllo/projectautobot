defmodule Models.Game.GamerTag do
  use Models.Model
  alias Models.Game.GamerTag

  schema "gamer_tags" do
    field :tag, :string
    field :overwatch_name, :string
    field :portrait_url, :string

    field :competitive_level, :integer
    field :competitive_rank_url, :string

    field :region, :string
    field :platform, :string, null: false

    field :level, :integer
    field :level_url, :integer

    field :total_games_won, :integer

    belongs_to :user, Models.Accounts.User
    has_many :snapshot_statistics, Models.Statistics.Snapshot

    timestamps()
  end

  @required_fields [:tag, :platform]
  @allowed_fields Enum.concat(@required_fields, [
    :overwatch_name, :portrait_url,
    :competitive_level, :competitive_rank_url,
    :region, :level, :level_url,
    :total_games_won, :user_id
  ])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%GamerTag{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> validate_inclusion(:platform, ["xbl", "psn", "pc"])
      |> validate_region
      |> unique_constraint(:tag, name: :tag_platform_index)
      |> cast_assoc(:user)
  end

  defp validate_region(changeset) do
    if changeset.platform === "pc" do
      validate_inclusion(changeset, :region, ["us", "eu", "kr", "cn"])
    else
      changeset
    end
  end
end
