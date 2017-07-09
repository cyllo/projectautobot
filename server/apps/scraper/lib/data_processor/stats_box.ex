defmodule Scraper.DataProcessor.StatsBox do
  @cardbox_container "[data-group-id='stats']"
  @cardbox_cards ".data-table tbody tr"
  @cardbox_row_stats "tr td"

  alias Scraper.HtmlHelpers

  def parse_hero_stats(%{name: name, code: code}, src) do
    stats = code
      |> hero_code_stats(src)
      |> Enum.map(&get_stats_from_table_row/1)
      |> Enum.filter(&is_known_stat/1)
      |> Enum.reduce(%{}, &deserialize_statistic/2)

    %{name: name, code: code, stats: stats}
  end

  defp get_stats_from_table_row(table_row) do
    table_row
      |> Floki.find(@cardbox_row_stats)
      |> Enum.map(&Floki.text/1)
  end



  defp name_to_atom(name) do
    name
      |> String.replace(~r/- |'|-/, "")
      |> String.downcase
      |> HtmlHelpers.normalize_and_snake
      |> Utility.safe_atom
  end

  defp deserialize_value(value) do
    cond do
      Regex.match?(numbers_regex(), value) -> parse_time_to_seconds(value)
      contains_percentage?(value) -> String.replace(value, "%", "") |> String.to_integer
      String.contains?(value, ".") -> value |> String.replace(",", "") |> String.to_float
      String.contains?(value, ",") -> string_to_intenger_with_replace(value, ",")
      String.contains?(value, ":") -> parse_clock_time_to_seconds(value)
      value === "--" -> 0
      true -> String.to_integer(value)
    end
  end

  defp parse_clock_time_to_seconds(time) when is_bitstring(time), do: time |> String.split(":") |> parse_clock_time_to_seconds
  defp parse_clock_time_to_seconds([hours, minutes, seconds]) do
    min_seconds = minutes_to_seconds(minutes)
    hour_seconds = hours_to_seconds(hours)

    String.to_integer(seconds) + hour_seconds + min_seconds
  end

  defp parse_clock_time_to_seconds([minutes, seconds]), do: minutes_to_seconds(minutes) + String.to_integer(seconds)
  defp parse_clock_time_to_seconds([seconds]), do: String.to_integer(seconds)

  def parse_seconds(str) do
    if String.contains?(str, ".") do
      str |> String.to_float |> round
    else
      String.to_integer(str)
    end
  end

  def parse_time_to_seconds(%{"time" => duration, "unit" => "minutes"}), do: minutes_to_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "minute"}), do: minutes_to_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "hours"}), do: hours_to_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "hour"}), do: hours_to_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "seconds"}), do: parse_seconds(duration)
  def parse_time_to_seconds(%{"time" => duration, "unit" => "second"}), do: parse_seconds(duration)

  def parse_time_to_seconds(string) do
    numbers_regex()
      |> Regex.named_captures(string)
      |> parse_time_to_seconds
  end

  defp deserialize_statistic([name, value], acc) do
    name = if contains_percentage?(value), do: name <> " percentage", else: name

    Map.put acc, name_to_atom(name), deserialize_value(value)
  end

  defp contains_percentage?(str), do: String.contains?(str, "%")
  defp minutes_to_seconds(min), do: String.to_integer(min) * 60
  defp hours_to_seconds(hours), do: String.to_integer(hours) * 60 * 60
  defp numbers_regex, do: ~r/(?<time>\d+(\.\d+)?) (?<unit>.+)/
  defp string_to_intenger_with_replace(string, replace_char), do: string |> String.replace(replace_char, "") |> String.to_integer
  defp is_known_stat([name, _]), do: !(name =~ ~r/overwatch\.guid\..*/)
  defp hero_code_stats(code, src), do: Floki.find(src, @cardbox_container <> "[data-category-id='#{code}'] " <> @cardbox_cards)
end
