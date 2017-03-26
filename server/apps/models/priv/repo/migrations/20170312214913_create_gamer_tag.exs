defmodule Api.Repo.Migrations.CreateGamerTags do
  use Ecto.Migration

  def change do
    create table(:gamer_tags) do
      add :tag, :text, null: false
      add :overwatch_name, :text
      add :portrait_url, :text

      add :competitive_level, :integer
      add :competitive_rank_url, :text

      add :region, :text
      add :platform, :citext, null: false

      add :level, :integer
      add :rank_url, :text

      add :total_games_won, :integer

      add :user_id, references(:users)

      timestamps()
    end

    create unique_index(:gamer_tags, [:tag])
  end
end
