defmodule Models.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS citext"

    create table(:users) do
      add :display_name, :citext, null: false
      add :email, :citext, null: false
      add :password_hash, :text, null: false
      add :battle_net_id, :integer, null: false
      add :battle_net_tag, :text, null: false
      add :is_admin, :boolean, default: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:users, [:display_name])
    create unique_index(:users, [:email])
    create unique_index(:users, [:battle_net_id])
    create unique_index(:users, [:battle_net_tag])
  end
end
