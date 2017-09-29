defmodule Api.Repo.Migrations.CreateApi.Statistics.Profile do
  use Ecto.Migration

  def change do
    create table(:profile_statistics) do
      add :total_games_won, :integer
      add :competitive_bracket_name, :string
      add :competitive_level, :integer
      add :competitive_rank_url, :string
      add :level, :integer
      add :level_url, :string
      add :rank_url, :string
      add :gamer_tag_id, references(:gamer_tags)
    end

    create index(:profile_statistics, [:gamer_tag_id])
  end
end
