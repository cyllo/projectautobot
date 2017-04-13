defmodule Api.SnapshotStatisticResolver do
  require IEx
  alias Models.Statistics.Snapshots
  alias Models.Game

  def get_gamer_tag_snapshot_statistics(_, [gamer_tag_id]), do: Snapshots.get_gamer_tag_snapshot_statistics(gamer_tag_id)
  def get_all_heroes_statistic(_, [snapshot_id]), do: Snapshots.get_all_heroes_statistic_for_snapshot(snapshot_id)
  def get_hero_statistics_by_snapshot_ids(a, snapshot_ids) do
    res = snapshot_ids |> Snapshots.get_all_hero_statistics_by_snapshot_ids |> convert_to_id_map(:snapshot_statistic_id)

    IO.inspect res

    res
  end
  def get_hero(_, hero_ids), do: hero_ids |> Game.get_all_heroes_by_ids |> convert_to_id_map

  defp convert_to_id_map(models, id_key) when is_list(models), do: Enum.group_by(models, &Map.get(&1, id_key))
  defp convert_to_id_map(models) when is_list(models), do: Map.new(models, &{&1.id, &1})
  defp convert_to_id_map(any), do: any
end
