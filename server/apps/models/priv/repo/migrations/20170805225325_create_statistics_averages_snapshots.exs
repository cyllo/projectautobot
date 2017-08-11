defmodule Models.Repo.Migrations.CreateStatisticsAveragesSnapshots do
  use Ecto.Migration

  def change do
    create table(:statistics_averages_snapshots) do
      add :hero_total_competitive_averages, :jsonb
      add :hero_total_quickplay_averages, :jsonb
      add :hero_competitive_averages, :jsonb
      add :hero_quickplay_averages, :jsonb

      timestamps(type: :utc_datetime)
    end
  end
end
