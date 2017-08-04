defmodule Models.Repo.Migrations.CreateHeroSnapshotStatisticTypes do
  use Ecto.Migration

  def up do
    HeroStatisticTypeEnum.create_type
  end

  def down do
    HeroStatisticTypeEnum.drop_type
  end
end
