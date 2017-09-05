defmodule SnapshotStatsDiffer.RecursiveDiffer do
  @black_list_props [
    :leaderboard_snapshot_statistic,
    :__meta__, :__struct__, :gamer_tag,
    :snapshot_statistic, :hero, :hero_specific_statistic,
    :inserted_at, :updated_at, :statistics_averages_snapshot
  ]

  def is_different?(nil, nil), do: false
  def is_different?(%Decimal{} = a, %Decimal{} = b), do: !Decimal.equal?(Decimal.compare(b, a), Decimal.new(0))
  def is_different?(a, b) when is_integer(a) and is_integer(b), do: b - a !== 0
  def is_different?(a, b) when is_bitstring(a) and is_bitstring(b), do: is_different?(Decimal.new(a), Decimal.new(b))

  def is_different?(a, b) when is_map(a) and is_map(b) do
    a
      |> drop_and_filter_blacklist_keys
      |> Enum.any?(fn {key, value} -> is_different?(value,  Map.get(b, key)) end)
  end
  def is_different?(_, _), do: false

  def diff(nil, nil), do: false
  def diff(%Decimal{} = a, %Decimal{} = b), do: diff_decimal(a, b)
  def diff(a, b) when is_integer(a) and is_integer(b), do: b - a
  def diff(a, b) when is_bitstring(a) and is_bitstring(b), do: diff(Decimal.new(a), Decimal.new(b))

  def diff(a, b) when is_map(a) and is_map(b) do
    a
      |> drop_and_filter_blacklist_keys
      |> Enum.reduce(%{}, fn {key, value}, acc ->
        diff_value = diff(value,  Map.get(b, key))

        if diff_value, do: Map.put(acc, key, diff_value), else: acc
      end)
  end
  def diff(_, _), do: false

  defp diff_decimal(a, b) do
    res = Decimal.sub(b, a)
    dec_0 = Decimal.new(0)

    if  Decimal.compare(dec_0, res) |> Decimal.equal?(dec_0) do
      dec_0
    else
      res
    end
  end

  defp drop_and_filter_blacklist_keys(map) do
    map
      |> Map.drop(@black_list_props)
      |> Map.to_list
      |> Enum.filter(fn
        {key, _} when is_atom(key) -> !Utility.atom_matches?(key, ~r/id|url/)
        {_, _} -> true
      end)
  end
end
