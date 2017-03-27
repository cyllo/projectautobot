defmodule Models.Repo.Migrations.CreateSnapshotStatistics do
  use Ecto.Migration

  def change do
    create table(:snapshot_statistics) do
      add :is_competitive, :boolean
      add :gamer_tag_id, references(:gamer_tags)

      timestamps()
    end
  end
end
