defmodule Scraper.Helpers do
  @normalization_regex ~r/(?<name>.*)#(?<number>\d+)/

  def uniq_list(list1, list2) do
    MapSet.union(MapSet.new(list1), MapSet.new(list2))
      |> Enum.to_list
  end

  def normalize_gamer_tag(tag) do
    if Regex.match?(@normalization_regex, tag) do
      %{"name" => name, "number" => number} = Regex.named_captures @normalization_regex, tag

      "#{name}-#{number}"
    else
      tag
    end
  end
end
