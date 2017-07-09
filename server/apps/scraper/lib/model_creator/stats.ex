defmodule Scraper.ModelCreator.Stats do
  alias Models.Statistics.Snapshots

  def create_snapshot(%{heroes_stats: heroes_stats, general_stats: general_stats}, %{id: gamer_tag_id}, competitive?: competitive?) do
    Snapshots.create_snapshot(gamer_tag_id, heroes_stats, general_stats, competitive?)
  end
end
