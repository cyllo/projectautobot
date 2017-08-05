defmodule Models.Repo.Migrations.CreateFollowers do
  use Ecto.Migration

  def change do
    create table(:followers, primary_key: false) do
      add :user_id, references(:users), primary_key: true, null: false
      add :follower_id, references(:users), primary_key: true, null: false

      timestamps(type: :utc_datetime)
    end

    create index(:followers, [:user_id])
    create index(:followers, [:follower_id])
  end
end
