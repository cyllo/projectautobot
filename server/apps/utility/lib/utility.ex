defmodule Utility do
  @normalization_regex ~r/(?<name>.*)-(?<number>\d+)/
  @hash_regex ~r/(?<name>.*)#(?<number>\d+)/

  @spec unwrap_ok_or_raise({atom, any}) :: any
  def unwrap_ok_or_raise({:ok, a}), do: a
  def unwrap_ok_or_raise({:error, error}), do: raise error

  @spec pluck(input :: list, key :: atom|String.t) :: list
  def pluck(list, key), do: Enum.map(list, &Map.get(&1, key))

  @spec uniq_list(Enum.t, Enum.t) :: Enum.t
  def uniq_list(list1, list2) do
    MapSet.union(MapSet.new(list1), MapSet.new(list2))
      |> Enum.to_list
  end

  @spec safe_atom(String.t) :: atom
  def safe_atom(name) do
    try do
      String.to_existing_atom(name)
    rescue
      ArgumentError -> String.to_atom(name)
    end
  end

  @spec key_equals(atom, String.t) :: boolean
  def key_equals(key, string) when is_atom(key), do: string |> Regex.compile! |> Regex.match?("\b" <> Atom.to_string(key) <> "\b")

  @spec ms_to_sec(integer) :: integer
  def ms_to_sec(ms), do: div(ms, 1000)

  @spec ms_to_min(integer) :: integer
  def ms_to_min(ms), do: Float.round(ms_to_sec(ms) / 60, 2)

  @spec sec_to_ms(integer) :: integer
  def sec_to_ms(sec), do: sec * 1000

  @spec normalize_gamer_tag(String.t) :: String.t
  def normalize_gamer_tag(tag), do: transform_gamer_tag(@normalization_regex, "#", tag)

  @spec dash_gamer_tag(String.t) :: String.t
  def dash_gamer_tag(tag), do: transform_gamer_tag(@hash_regex, "-", tag)

  @spec transform_gamer_tag(Regex.t, String.t, String.t) :: String.t
  defp transform_gamer_tag(regex, replacement, tag) do
    if Regex.match?(regex, tag) do
      %{"name" => name, "number" => number} = Regex.named_captures regex, tag

      name <> replacement <> number
    else
      tag
    end
  end
end
