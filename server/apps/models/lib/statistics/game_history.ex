defmodule Models.Statistics.GameHistory do
  use Models.Model
  alias Models.Statistics.GameHistory

  schema "game_history_statistics" do
    field :games_played, :integer, null: false, default: 0
    field :games_won, :integer, null: false, default: 0
    field :games_lost, :integer, null: false, default: 0
    field :time_played, :integer, null: false, default: 0
    field :time_spent_on_fire, :integer
    field :win_percentage, :integer
  end

  @allowed_fields [
    :games_played,
    :games_won,
    :games_lost,
    :time_played,
    :time_spent_on_fire,
    :win_percentage
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%GameHistory{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
  end

  def create_changeset(params), do: changeset(%GameHistory{}, params)
end
