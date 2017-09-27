defmodule StatsAverages.AveragesCreator do
  alias Models.Statistics.Snapshots

  def create_snapshot do
    case Snapshots.get_first_snapshot_statistic do
      nil -> {:error, "No snapshots to use for averages"}
      _ ->
        create_averages_params()
          |> Snapshots.create_averages
    end
  end

  def create_averages_params do
    %{
      heroes_total_snapshot_statistic: quickplay_total_averages,
      hero_snapshot_statistics: quickplay_hero_averages
    } = Snapshots.average(:quickplay)

    %{
      heroes_total_snapshot_statistic: competitive_total_averages,
      hero_snapshot_statistics: competitive_hero_averages
    } = Snapshots.average(:competitive)

    %{
      hero_total_competitive_averages: competitive_total_averages,
      hero_total_quickplay_averages: quickplay_total_averages,
      hero_competitive_averages: competitive_hero_averages,
      hero_quickplay_averages: quickplay_hero_averages
    }
  end
end
