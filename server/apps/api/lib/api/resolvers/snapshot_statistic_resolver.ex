defmodule Api.SnapshotStatisticResolver do
  alias Models.Statistics.Snapshots
  alias Models.{Game, Statistics}

  import Api.Helpers, only: [preload_id_map: 2, convert_to_id_map: 3, convert_to_id_map: 2]

  def get_gamer_tag_snapshot_statistics(params, gamer_tag_ids) do
    gamer_tag_ids
      |> Snapshots.get_snapshot_statistics_by_gamer_tag_ids(params)
      |> convert_to_id_map(gamer_tag_ids, :gamer_tag_id)
  end

  def get_heroes_totals_by_snapshot_ids(%{type: type}, snapshot_ids) do
    snapshot_ids
      |> Snapshots.get_all_hero_total_statistics_by_snapshot_ids(type)
      |> convert_to_id_map(snapshot_ids, :snapshot_statistic_id)
  end

  def get_snapshots_profile_snapshots(_, snapshots), do: preload_id_map(snapshots, :profile_snapshot_statistic)
  def get_profile_snapshots_gamer_tags(_, profile_snapshots), do: preload_id_map(profile_snapshots, :gamer_tag)
  def get_profile_snapshots_profile_stats(_, profile_snapshots) do
    preload_id_map(profile_snapshots, :profile_statistic)
  end

  # def get_all_heroes_statistics_by_snapshot_ids(_, snapshot_ids) do
  #   snapshot_ids
  #     |> Snapshots.get_all_of_all_heroes_statistics_by_snapshot_ids
  #     |> convert_to_id_map(snapshot_ids, :snapshot_statistic_id)
  # end

  def get_hero_statistics_by_snapshot_ids(%{type: type}, snapshot_ids) do
    snapshot_ids
      |> Snapshots.get_all_hero_statistics_by_snapshot_ids(type)
      |> convert_to_id_map(snapshot_ids, :snapshot_statistic_id)
  end

  def get_combat_best_statistics(_, ids), do: ids |> Statistics.get_combat_bests_by_ids |> convert_to_id_map(ids)
  def get_combat_average_statistics(_, ids), do: ids |> Statistics.get_combat_averages_by_ids |> convert_to_id_map(ids)
  def get_combat_lifetime_statistics(_, ids), do: ids |> Statistics.get_combat_lifetimes_by_ids |> convert_to_id_map(ids)
  def get_hero_specific_statistics(_, ids), do: ids |> Statistics.get_hero_specifics_by_ids |> convert_to_id_map(ids)
  def get_match_award_statistics(_, ids), do: ids |> Statistics.get_match_awards_by_ids |> convert_to_id_map(ids)
  def get_game_history_statistics(_, ids), do: ids |> Statistics.get_game_histories_by_ids |> convert_to_id_map(ids)

  def get_heroes_by_ids(_, hero_ids), do: hero_ids |> Game.get_heroes_by_ids |> convert_to_id_map(hero_ids)
end
