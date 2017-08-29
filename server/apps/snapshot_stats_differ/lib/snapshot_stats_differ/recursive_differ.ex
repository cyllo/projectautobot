defmodule SnapshotStatsDiffer.RecursiveDiffer do
  @black_list_props [:__meta__, :__struct__, :gamer_tag, :snapshot_statistic, :hero, :hero_specific_statistic]

  def diff(%Decimal{} = a, %Decimal{} = b), do: Decimal.sub(b, a)
  def diff(a, b) when is_integer(a) and is_integer(b), do: b - a

  def diff(a, b) when is_map(a) and is_map(b) do
    a
      |> Map.drop(@black_list_props)
      |> Map.to_list
      |> Enum.filter(fn
        {key, _} when is_atom(key) -> !Utility.atom_matches?(key, ~r/id/)
        {_, _} -> true
      end)
      |> Enum.reduce(%{}, fn {key, value}, acc ->
        diff_value = diff(value,  Map.get(b, key))

        if diff_value, do: Map.put(acc, key, diff_value), else: acc
      end)
  end

  def diff(_, _), do: false
end
