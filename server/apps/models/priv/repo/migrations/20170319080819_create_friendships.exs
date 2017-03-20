defmodule Models.Repo.Migrations.CreateFriendships do
  use Ecto.Migration

  def change do
    create table(:friendships) do
      add :is_accepted, :boolean, default: false
      add :user_id, references(:users)
      add :friend_id, references(:users)

      timestamps()
    end
  end
end
