defmodule Api.HeroStatisticResolver do
  alias Models.Statistics.Snapshots

  def get_hero_statistics(__, [snapshot_id]), do: Snapshots.get_hero_statistics_for_snapshot(snapshot_id)
end
