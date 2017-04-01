defmodule Models.Repo.Migrations.CreateHeroes do
  use Ecto.Migration

  def change do
    create table(:heroes) do
      add :name, :citext, null: false

      timestamps()
    end
  end
end
