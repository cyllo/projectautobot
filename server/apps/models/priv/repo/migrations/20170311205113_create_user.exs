defmodule Models.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS citext"

    create table(:users) do
      add :username, :citext, null: false
      add :email, :citext, null: false
      add :password_hash, :text, null: false
      add :is_admin, :boolean, default: false

      timestamps()
    end

    create unique_index(:users, [:username])
    create unique_index(:users, [:email])
  end
end
