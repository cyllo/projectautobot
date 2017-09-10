defmodule Models.Statistics.GameHistory do
  use Models.Model
  alias Models.Statistics.GameHistory

  schema "game_history_statistics" do
    field :games_tied, :integer
    field :games_played, :integer, null: false, default: 0
    field :games_won, :integer, null: false, default: 0
    field :games_lost, :integer, null: false, default: 0
    field :time_played, :integer, null: false, default: 0
    field :win_percentage, :decimal
  end

  @allowed_fields [
    :games_played,
    :games_won,
    :games_lost,
    :games_tied,
    :time_played,
    :win_percentage
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%GameHistory{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> put_win_percentage
      |> put_games_lost
  end

  def create_changeset(params), do: changeset(%GameHistory{}, params)

  defp put_games_lost(changeset) do
    put_change_if_games_won_and_played(changeset, :games_lost, fn games_won, games_played -> games_played - games_won end)
  end

  defp put_win_percentage(changeset) do
    put_change_if_games_won_and_played(changeset, :win_percentage, fn games_won, games_played -> games_won / games_played * 100 end)
  end

  defp put_change_if_games_won_and_played(changeset, key, function) do
    with {:ok, games_won} <- fetch_change(changeset, :games_won),
         {:ok, games_played} <- fetch_change(changeset, :games_played) do
      put_change(changeset, key, function.(games_won, games_played))
    else
      _ -> changeset
    end
  end
end
