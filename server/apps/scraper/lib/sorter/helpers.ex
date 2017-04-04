defmodule Scarper.Sorter.Helpers do
  def key_equals(key, string) when is_atom(key), do: string |> Regex.compile! |> Regex.match?("\b" <> Atom.to_string(key) <> "\b")
  def transform_key_lists_to_map(map), do: for {k, v} <- map, into: %{}, do: {k, Map.new(v)}

  def categorize_stats(stats, group_by_fun) do
    stats
      |> Enum.group_by(group_by_fun)
      |> transform_key_lists_to_map
  end

  def is_match_award_stat?(key), do: key_equals(key, "(cards|medals)")
  def is_game_tracking_stat?(key), do: key_equals(key, "games_(played|won|lost)")
end
