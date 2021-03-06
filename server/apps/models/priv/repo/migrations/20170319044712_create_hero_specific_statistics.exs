defmodule Models.Repo.Migrations.CreateHeroSpecificStatistics do
  use Ecto.Migration

  def change do
    create table(:hero_specific_statistics) do
      add :stats, :jsonb
      add :hero_id, references(:heroes)
    end

    create index(:hero_specific_statistics, [:hero_id])
  end
end
