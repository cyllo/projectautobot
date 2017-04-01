defmodule Api.Repo.Migrations.CreateGamerTags do
  use Ecto.Migration

  def change do
    create table(:gamer_tags) do
      add :tag, :text, null: false
      add :platform, :citext, null: false
      add :region, :citext
      add :overwatch_name, :text
      add :total_games_won, :integer
      add :user_id, references(:users)

      timestamps()
    end

  end
end
