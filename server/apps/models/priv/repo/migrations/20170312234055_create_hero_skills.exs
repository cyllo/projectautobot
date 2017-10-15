defmodule Models.Repo.Migrations.CreateHeroSkills do
  use Ecto.Migration

  def change do
    create table(:hero_skills) do
      add :name, :citext, null: false
      add :description, :text, null: false
      add :icon_url, :text, null: false
      add :hero_id, references(:heroes), null: false
    end

    create index(:hero_skills, [:hero_id])
    create unique_index(:hero_skills, [:name])
    create unique_index(:hero_skills, [:description])
    create unique_index(:hero_skills, [:icon_url])
  end
end
