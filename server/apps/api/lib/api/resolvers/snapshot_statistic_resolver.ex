defmodule Api.SnapshotStatisticResolver do
  import IEx
  alias Models.Statistics.Snapshots
  alias Models.{Game, Statistics}

  def get_gamer_tag_snapshot_statistics(_, [gamer_tag_id]), do: Snapshots.get_gamer_tag_snapshot_statistics(gamer_tag_id)
  def get_gamer_tag_snapshot_statistics(_, gamer_tag_ids) do
    gamer_tag_ids
      |> Snapshots.get_gamer_tags_snapshot_statistics_by_ids
      |> convert_to_id_map(gamer_tag_ids)
  end

  def get_all_heroes_statistics_by_snapshot_ids(_, snapshot_ids) do
    snapshot_ids
      |> Snapshots.get_all_of_all_heroes_statistics_by_snapshot_ids
      |> convert_to_id_map(snapshot_ids)
  end

  def get_hero_statistics_by_snapshot_ids(_, snapshot_ids) do
    snapshot_ids
      |> Snapshots.get_all_hero_statistics_by_snapshot_ids
      |> convert_to_id_map(:snapshot_statistic_id)
  end

  def get_combat_best_statistics(_, ids), do: ids |> Statistics.get_combat_bests_by_ids |> convert_to_id_map(ids)
  def get_combat_average_statistics(_, ids), do: ids |> Statistics.get_combat_averages_by_ids |> convert_to_id_map(ids)
  def get_combat_lifetime_statistics(_, ids), do: ids |> Statistics.get_combat_lifetimes_by_ids |> convert_to_id_map(ids)
  def get_hero_specific_statistics(_, ids), do: ids |> Statistics.get_hero_specifics_by_ids |> convert_to_id_map(ids)
  def get_game_history_statistics(_, ids), do: ids |> Statistics.get_game_histories_by_ids |> convert_to_id_map(ids)
  def get_match_award_statistics(_, ids), do: ids |> Statistics.get_match_awards_by_ids |> convert_to_id_map(ids)


  def get_heroes_by_ids(_, hero_ids), do: hero_ids |> Game.get_heroes_by_ids |> convert_to_id_map(hero_ids)

  defp convert_to_id_map(models, id_key) when is_list(models) and is_atom(id_key), do: Enum.group_by(models, &Map.get(&1, id_key))
  defp convert_to_id_map(models) when is_list(models), do: Map.new(models, &{&1.id, &1})
  defp convert_to_id_map(models, ids) when is_list(ids) and is_list(models), do: for id <- ids, model <- models, into: %{}, do: {id, model}
  defp convert_to_id_map([], ids) when is_list(ids), do: Enum.reduce(ids, %{}, fn(id, acc) -> Map.put(acc, id, []) end)
  defp convert_to_id_map(any, _), do: any
  defp convert_to_id_map(any), do: any
end
