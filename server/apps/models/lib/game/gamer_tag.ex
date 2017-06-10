defmodule Models.Game.GamerTag do
  use Models.Model
  alias Models.Game.GamerTag
  alias Models.Helpers

  schema "gamer_tags" do
    field :tag, :string
    field :overwatch_name, :string
    field :portrait_url, :string
    field :total_games_won, :integer

    field :competitive_level, :integer
    field :competitive_rank_url, :string

    field :region, :string, default: "" # empty string default to satisfy null region for unique
    field :platform, :string

    field :level, :integer
    field :level_url, :string

    belongs_to :user, Models.Accounts.User
    has_many :snapshot_statistics, Models.Statistics.Snapshots.SnapshotStatistic

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
      |> unique_constraint(:tag, name: :tag_platform_region_index)
      |> cast_assoc(:user)
      |> update_change(:tag, &Helpers.normalize_gamer_tag/1)
  end

  def create_changeset(params), do: changeset(%GamerTag{}, params)

  defp validate_region(changeset) do
    if get_field(changeset, :platform) === "pc" do
      changeset
        |> validate_required(:region)
        |> validate_inclusion(:region, ["us", "eu", "kr", "cn"], message: "region must be one of 'us', 'eu', 'kr', 'cn'")
    else
      changeset
    end
  end
end
