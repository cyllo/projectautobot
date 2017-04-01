defmodule Models.Repo.Migrations.CreateHeroSpecificStatistics do
  use Ecto.Migration

  def change do
    create table(:hero_specific_statistics) do
      add :stats, :json
      add :hero_id, references(:heroes)
    end
  end
end
