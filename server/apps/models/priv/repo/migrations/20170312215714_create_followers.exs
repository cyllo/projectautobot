defmodule Models.Repo.Migrations.CreateFollowers do
  use Ecto.Migration

  def change do
    create table(:followers, primary_key: false) do
      add :user_id, references(:users), primary_key: true
      add :follower_id, references(:users), primary_key: true

      timestamps()
    end
  end
end
