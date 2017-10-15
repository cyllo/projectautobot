defmodule Models.Repo.Migrations.CreateHeroes do
  use Ecto.Migration

  def change do
    create table(:heroes) do
      add :name, :citext, null: false
      add :description, :text, null: false
      add :select_portrait_url, :text, null: false
      add :icon_portrait_url, :text, null: false
      add :role_id, references(:hero_roles), null: false

      timestamps(type: :utc_datetime)
    end

    create index(:heroes, [:role_id])
    create unique_index(:heroes, [:name])
  end
end
