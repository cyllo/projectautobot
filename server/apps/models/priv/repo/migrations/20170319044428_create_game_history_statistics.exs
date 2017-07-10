defmodule Models.Repo.Migrations.CreateGameHistoryStatistics do
  use Ecto.Migration

  def change do
    create table(:game_history_statistics) do
      add :games_tied, :integer, null: false, default: 0
      add :games_played, :integer, null: false, default: 0
      add :games_won, :integer, null: false, default: 0
      add :games_lost, :integer, null: false, default: 0
      add :time_played, :integer, null: false, default: 0
      add :time_spent_on_fire, :integer, null: false, default: 0
      add :win_percentage, :integer, null: false, default: 0
    end
  end
end
