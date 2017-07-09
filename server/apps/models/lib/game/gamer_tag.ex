defmodule Models.Game.GamerTag do
  use Models.Model
  alias Models.{Repo, Game, Game.GamerTag, Accounts.User}

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

    many_to_many :user_followers, User, join_through: "gamer_tag_user_followers",
                                        join_keys: [gamer_tag_id: :id, user_id: :id],
                                        unique: true,
                                        on_delete: :delete_all

    many_to_many :connected_gamer_tags, GamerTag, join_through: "connected_gamer_tags",
                                                  join_keys: [gamer_tag1_id: :id, gamer_tag2_id: :id]

    timestamps()
  end

  @required_fields [:tag, :platform]
  @allowed_fields Enum.concat(@required_fields, [
    :overwatch_name, :portrait_url,
    :competitive_level, :competitive_rank_url,
    :region, :level, :level_url,
    :total_games_won, :user_id,
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
      |> cast_connected_gamer_tags(params)
      |> update_change(:tag, &Utility.normalize_gamer_tag/1)
  end

  def create_changeset(params), do: changeset(%GamerTag{}, params)

  # this should cast but cant figure out updates since theres' no pkey it errors.
  def cast_connected_gamer_tags(changeset, params) do
    if Map.has_key?(params, :connected_gamer_tags) do
      Enum.map(params.connected_gamer_tags, &Game.get_or_insert_connected_gamer_tag(changeset.data, &1))

      changeset
    else
      changeset
    end
  end

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
