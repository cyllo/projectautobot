defmodule Models.Repo.Migrations.CreateMatchAwardsStatistics do
  use Ecto.Migration

  def change do
    create table(:match_awards_statistics) do
      add :bronze_medals, :integer
      add :silver_medals, :integer
      add :gold_medals, :integer
      add :total_metals, :integer
      add :cards, :integer
    end
  end
end
