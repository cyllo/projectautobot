defmodule Models.Repo.Migrations.CreateFriendships do
  use Ecto.Migration

  def change do
    create table(:friendships) do
      add :is_accepted, :boolean, default: false
      add :is_sender, :boolean, default: false
      add :user_id, references(:users), null: false
      add :friend_id, references(:users), null: false
      add :primary_gamer_tag_id, references(:gamer_tags)

      timestamps(type: :utc_datetime)
    end

    create index(:friendships, [:primary_gamer_tag_id])
    create index(:friendships, [:friend_id])
    create index(:friendships, [:user_id])
  end
end
