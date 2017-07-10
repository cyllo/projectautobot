defmodule Models.Repo.Migrations.CreateMatchAwardsStatistics do
  use Ecto.Migration

  def change do
    create table(:match_awards_statistics) do
      add :bronze_medals, :integer, null: false, default: 0
      add :silver_medals, :integer, null: false, default: 0
      add :gold_medals, :integer, null: false, default: 0
      add :total_medals, :integer, null: false, default: 0
      add :cards, :integer, null: false, default: 0
    end
  end
end
