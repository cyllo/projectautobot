defmodule Models.Repo.Migrations.CreateConnectedGamerTagsTable do
  use Ecto.Migration

  def change do
    create table(:connected_gamer_tags, primary_key: false) do
      add :gamer_tag1_id, references(:gamer_tags), primary_key: true, null: false
      add :gamer_tag2_id, references(:gamer_tags), primary_key: true, null: false
    end

    create index(:connected_gamer_tags, [:gamer_tag1_id])
    create index(:connected_gamer_tags, [:gamer_tag2_id])
  end
end
