defmodule Models.Repo.Migrations.AddPrimaryGamerTagIdColumns do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :primary_gamer_tag_id, references(:gamer_tags)
    end

    alter table(:friendships) do
      add :primary_gamer_tag_id, references(:gamer_tags)
    end

    create index(:users, [:primary_gamer_tag_id])
    create index(:friendships, [:primary_gamer_tag_id])
  end
end
