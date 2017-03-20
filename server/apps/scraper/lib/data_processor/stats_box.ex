defmodule Scraper.DataProcessor.StatsBox do
  @cardbox_container "[data-group-id='stats']"
  @cardbox_cards ".data-table tbody tr"

  def parse_hero_stats(%{name: name, code: code}, src) do
    stats = code
      |> hero_code_stats(src)
      |> Enum.map(&get_stats_from_table_row/1)
      |> Enum.filter(&is_known_stat/1)
      |> Enum.reduce(%{}, &deserialize_statistic/2)

    Map.put(%{name: name, code: code}, :stats, stats)
  end

  defp get_stats_from_table_row(table_row) do
    table_row
      |> Floki.find("tr td")
      |> Enum.map(&Floki.text/1)
  end


  defp name_to_atom(name) do
    name
      |> String.replace(~r/-|'/, "")
      |> String.downcase
      |> String.split
      |> Enum.join("_")
      |> String.to_atom
  end

  defp deserialize_value(value) do
    cond do
      Regex.match?(numbers_regex(), value) -> parse_time_to_seconds(value)
      String.contains?(value, "%") -> value
      String.contains?(value, ".") -> value |> String.replace(",", "") |> String.to_float
      String.contains?(value, ",") -> string_to_intenger_with_replace(value, ",")
      String.contains?(value, ":") -> parse_clock_time_to_seconds(value)
      true -> String.to_integer(value)
    end
  end

  defp parse_clock_time_to_seconds(<<hours::binary-size(2), ":", minutes::binary-size(2), ":", seconds::binary>>) do
    min_seconds = minutes_to_seconds(minutes)
    hour_seconds = hours_to_seconds(hours)

    String.to_integer(seconds) + hour_seconds + min_seconds
  end

  defp parse_clock_time_to_seconds(<<minutes::binary-size(2), ":", seconds::binary>>) do
    minutes_to_seconds(minutes) + String.to_integer(seconds)
  end

  def parse_time_to_seconds(%{"time" => duration, "unit" => "minutes"}), do: minutes_to_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "minute"}), do: minutes_to_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "hours"}), do: hours_to_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "hour"}), do: hours_to_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "seconds"}), do: duration
  def parse_time_to_seconds(%{"time" => duration, "unit" => "second"}), do: duration
  def parse_time_to_seconds(string) do
    numbers_regex()
      |> Regex.named_captures(string)
      |> parse_time_to_seconds
  end

  defp minutes_to_seconds(min), do: String.to_integer(min) * 60
  defp hours_to_seconds(hours), do: String.to_integer(hours) * 60 * 60
  defp numbers_regex, do: ~r/(?<time>\d+) (?<unit>.+)/
  defp string_to_intenger_with_replace(string, replace_char), do: string |> String.replace(replace_char, "") |> String.to_integer
  defp deserialize_statistic([name, value], acc), do: Map.put acc, name_to_atom(name), deserialize_value(value)
  defp is_known_stat([name, _]), do: !(name =~ ~r/overwatch\.guid\..*/)
  defp hero_code_stats(code, src), do: Floki.find(src, @cardbox_container <> "[data-category-id='#{code}'] " <> @cardbox_cards)
end
