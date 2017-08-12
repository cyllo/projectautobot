defmodule Models.Repo.Migrations.CreateSnapshotStatistics do
  use Ecto.Migration

  def change do
    create table(:snapshot_statistics) do
      add :gamer_tag_id, references(:gamer_tags)

      timestamps(type: :utc_datetime)
    end

    create index(:snapshot_statistics, [:gamer_tag_id])
  end
end
