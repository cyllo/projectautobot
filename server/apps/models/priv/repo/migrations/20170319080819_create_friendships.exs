defmodule Models.Repo.Migrations.CreateFriendships do
  use Ecto.Migration

  def change do
    create table(:friendships) do
      add :is_accepted, :boolean, default: false
      add :user_id, references(:users), null: false
      add :friend_id, references(:users), null: false

      timestamps()
    end
  end
end
