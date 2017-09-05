defmodule SnapshotStatsDiffer.HeroSnapshotStatsDiffer do
  alias SnapshotStatsDiffer.RecursiveDiffer

  def diff(snapshots_a, snapshots_b) do
    RecursiveDiffer.diff(convert_to_hero_map(snapshots_a), convert_to_hero_map(snapshots_b))
  end

  def is_different?(snapshots_a, snapshots_b) do
    RecursiveDiffer.is_different?(convert_to_hero_map(snapshots_a), convert_to_hero_map(snapshots_b))
  end

  defp group_by_type(snapshots), do: Enum.group_by(snapshots, &Map.get(&1, :statistic_type))

  defp convert_to_hero_map(snapshots) do
    %{
      hero_quickplay: hero_quickplay,
      hero_competitive: hero_competitive,
      hero_total_quickplay: %{nil: hero_total_quickplay},
      hero_total_competitive: %{nil: hero_total_competitive}
    } = snapshots |> group_by_type |> group_types_by_hero

    %{
      hero_quickplay: hero_quickplay,
      hero_competitive: hero_competitive,
      hero_total_quickplay: hero_total_quickplay,
      hero_total_competitive: hero_total_competitive
    }
  end

  defp group_types_by_hero(snapshot_types) do
    for {key, values} <- snapshot_types, into: %{} do
      values = values
        |> Enum.group_by(&Map.get(&1, :hero_id))
        |> Utility.map_values(&List.first/1)

      {key, values}
    end
  end
end
