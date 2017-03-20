defmodule Scarper.Sorter.Helpers do
  alias Scarper.Sorter.Helpers

  def key_equals(key, string) when is_atom(key), do: string |> Regex.compile! |> Regex.match?("\b" <> Atom.to_string(key) <> "\b")
  def transform_key_lists_to_map(map), do: for {k, v} <- map, into: %{}, do: {k, Map.new(v)}

  def categorize_stats(stats, group_by_fun) do
    stats
      |> Enum.group_by(group_by_fun)
      |> Helpers.transform_key_lists_to_map
  end

  def is_match_award_stat?(key), do: Helpers.key_equals(key, "(cards|medals)")
  def is_multikill_best_stat?(key), do: Helpers.key_equals(key, "multikill_best")
  def is_most_in_game_or_life_stat?(key), do: Helpers.key_equals(key, "most_in_(game|life)")
  def is_average_stat?(key), do: Helpers.key_equals(key, "average")
  def is_game_tracking_stat?(key), do: Helpers.key_equals(key, "games_(played|won|lost)")
end
