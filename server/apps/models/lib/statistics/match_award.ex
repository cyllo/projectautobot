defmodule Models.Statistics.MatchAward do
  use Models.Model
  alias Models.Statistics.MatchAward

  schema "match_awards_statistics" do
    field :bronze_medals, :integer
    field :silver_medals, :integer
    field :gold_medals, :integer
    field :total_medals, :integer
    field :cards, :integer
  end

  @allowed_fields [
    :bronze_medals,
    :silver_medals,
    :gold_medals,
    :total_medals,
    :cards
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%MatchAward{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
  end

  def create_changeset(params), do: changeset(%MatchAward{}, params)
end
