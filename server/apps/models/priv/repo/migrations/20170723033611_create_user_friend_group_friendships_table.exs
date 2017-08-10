defmodule Models.Repo.Migrations.CreateUserFriendGroupFriendshipsTable do
  use Ecto.Migration

  def change do
    create table(:user_friend_group_friendships) do
      add :friendship_id, references(:friendships, on_delete: :delete_all)
      add :user_friend_group_id, references(:user_friend_groups, on_delete: :delete_all)
    end
  end
end
