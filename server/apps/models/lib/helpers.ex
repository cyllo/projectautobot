defmodule Models.Helpers do
  @normalization_regex ~r/(?<name>.*)-(?<number>\d+)/
  @hash_regex ~r/(?<name>.*)#(?<number>\d+)/

  def uniq_list(list1, list2) do
    MapSet.union(MapSet.new(list1), MapSet.new(list2))
      |> Enum.to_list
  end

  def normalize_gamer_tag(tag), do: transform_gamer_tag(@normalization_regex, "#", tag)
  def dash_gamer_tag(tag), do: transform_gamer_tag(@hash_regex, "-", tag)

  defp transform_gamer_tag(regex, replacement, tag) do
    if Regex.match?(regex, tag) do
      %{"name" => name, "number" => number} = Regex.named_captures regex, tag

      name <> replacement <> number
    else
      tag
    end
  end
end
