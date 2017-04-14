defmodule Api.SnapshotStatisticResolver do
  require IEx
  alias Models.Statistics.Snapshots
  alias Models.{Game, Statistics}

  def get_gamer_tag_snapshot_statistics(_, [gamer_tag_id]), do: Snapshots.get_gamer_tag_snapshot_statistics(gamer_tag_id)

  def get_all_heroes_statistics_by_snapshot_ids(_, snapshot_ids) do
    snapshot_ids
      |> Snapshots.get_all_of_all_heroes_statistics_by_snapshot_ids
      |> convert_to_id_map
  end

  def get_hero_statistics_by_snapshot_ids(_, snapshot_ids) do
    snapshot_ids
      |> Snapshots.get_all_hero_statistics_by_snapshot_ids
      |> convert_to_id_map(:snapshot_statistic_id)
  end

  def get_combat_best_statistics(_, ids), do: ids |> Statistics.get_combat_bests_by_ids |> convert_to_id_map
  def get_combat_average_statistics(_, ids), do: ids |> Statistics.get_combat_averages_by_ids |> convert_to_id_map
  def get_combat_lifetime_statistics(_, ids), do: ids |> Statistics.get_combat_lifetimes_by_ids |> convert_to_id_map
  def get_hero_specific_statistics(_, ids), do: ids |> Statistics.get_hero_specifics_by_ids |> convert_to_id_map
  def get_game_history_statistics(_, ids), do: ids |> Statistics.get_game_histories_by_ids |> convert_to_id_map
  def get_match_award_statistics(_, ids), do: ids |> Statistics.get_match_awards_by_ids |> convert_to_id_map


  def get_heroes_by_ids(_, hero_ids), do: hero_ids |> Game.get_heroes_by_ids |> convert_to_id_map

  defp convert_to_id_map(models, id_key) when is_list(models), do: Enum.group_by(models, &Map.get(&1, id_key))
  defp convert_to_id_map(models) when is_list(models), do: Map.new(models, &{&1.id, &1})
  defp convert_to_id_map(any), do: any
end
