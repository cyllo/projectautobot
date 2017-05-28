# defmodule Models.Statistics.Snapshots.LatestSnapshotStatistic do
#   use Models.Model

#   schema "latest_snapshot_statistic" do
#     field :is_competitive, :boolean
#     belongs_to :gamer_tag, Models.Game.GamerTag
#     has_many :hero_snapshot_statistics, Models.Statistics.Snapshots.HeroStatistic
#     has_one :all_heroes_snapshot_statistics, Models.Statistics.Snapshots.AllHeroesStatistic

#     timestamps()
#   end
# end
