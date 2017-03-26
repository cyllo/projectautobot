defmodule Models.Statistics.GameHistory do
  use Models.Model

  schema "game_history_statistics" do
    field :games_played, :integer, null: false, default: 0
    field :games_won, :integer, null: false, default: 0
    field :games_lost, :integer, null: false, default: 0
    field :time_played, :integer, null: false, default: 0
    field :time_spent_on_fire, :integer
    field :win_percentage, :integer
  end
end
