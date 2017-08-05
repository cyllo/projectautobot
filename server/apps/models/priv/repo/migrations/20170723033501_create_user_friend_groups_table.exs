defmodule Models.Repo.Migrations.CreateUserFriendGroupsTable do
  use Ecto.Migration

  def change do
    create table(:user_friend_groups) do
      add :name, :text
      add :user_id, references(:users)

      timestamps(type: :utc_datetime)
    end

    create index(:user_friend_groups, [:user_id])
    create unique_index(:user_friend_groups, [:name, :user_id])
  end
end
