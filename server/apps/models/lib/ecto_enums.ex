import EctoEnum

defenum HeroStatisticTypeEnum, :hero_snapshot_statistic_type, [
  :hero_total_competitive, :hero_total_quickplay,
  :hero_competitive, :hero_quickplay
]

defmodule Models.Enums do
  @hero_snapshot_types [
    :hero_total_competitive, :hero_total_quickplay,
    :hero_competitive, :hero_quickplay
  ]

  def create_stats_type(stat_type, play_type), do: Utility.join_atoms(stat_type, play_type) |> verify_is_stat
  defp verify_is_stat(stat) when stat in @hero_snapshot_types, do: stat
  defp verify_is_stat(stat), do: raise "#{stat} is not a snapshot statistic type"

  def hero_snapshot_types, do: @hero_snapshot_types
end
