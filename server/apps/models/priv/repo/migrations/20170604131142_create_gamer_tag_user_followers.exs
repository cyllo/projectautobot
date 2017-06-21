defmodule Models.Repo.Migrations.CreateGamerTagUserFollowers do
  use Ecto.Migration

  def change do
    create table(:gamer_tag_user_followers, primary_key: false) do
      add :gamer_tag_id, references(:gamer_tags), primary_key: true, null: false
      add :user_id, references(:users), primary_key: true, null: false
    end
  end
end
