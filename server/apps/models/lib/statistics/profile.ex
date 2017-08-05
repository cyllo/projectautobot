defmodule Models.Statistics.Profile do
  use Models.Model
  alias Models.Statistics.Profile

  schema "profile_statistics" do
    field :competitive_level, :integer
    field :competitive_rank_url, :string
    field :level, :integer
    field :level_url, :string
    field :rank_url, :string
    field :total_games_won, :integer
    belongs_to :gamer_tag, Models.Game.GamerTag
  end

  @required_fields [
    :gamer_tag_id,
    :total_games_won, :level, :level_url
  ]
  @available_fields @required_fields ++ [:competitive_level, :competitive_rank_url, :rank_url]

  def changeset(%Profile{} = profile, attrs \\ %{}) do
    profile
      |> cast(attrs, @available_fields)
      |> validate_required(@required_fields)
  end

  def create_changeset(attrs), do: changeset(%Profile{}, attrs)
end
