defmodule Api.Repo.Migrations.CreateGamerTags do
  use Ecto.Migration

  def change do
    create table(:gamer_tags) do
      add :tag, :text, null: false
      add :overwatch_name, :text
      add :portrait_url, :text

      add :region, :citext, null: false, default: ""
      add :platform, :citext, null: false

      add :user_id, references(:users)

      timestamps(type: :utc_datetime)
    end

    create index(:gamer_tags, [:user_id])
    create unique_index(:gamer_tags, [:tag, :platform, :region], name: :tag_platform_region_index)
  end
end
