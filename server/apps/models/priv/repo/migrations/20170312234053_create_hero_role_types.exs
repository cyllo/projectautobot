defmodule Models.Repo.Migrations.CreateHeroRoles do
  use Ecto.Migration

  def change do
    create table(:hero_roles) do
      add :name, :citext, null: false
      add :svg_url, :text, null: false
    end

    create unique_index(:hero_roles, [:name])
    create unique_index(:hero_roles, [:svg_url])
  end
end
