defmodule Models.Repo.Migrations.CreateSnapshotStatistics do
  use Ecto.Migration

  def change do
    create table(:snapshot_statistics) do
      add :gamer_tag_id, references(:gamer_tags)

      timestamps()
    end
  end
end
