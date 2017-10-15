defmodule Utility do
  @normalization_regex ~r/(?<name>.*)-(?<number>\d+)/
  @hash_regex ~r/(?<name>.*)#(?<number>\d+)/

  @spec unwrap_ok_or_raise({atom, any}) :: any
  def unwrap_ok_or_raise({:ok, a}), do: a
  def unwrap_ok_or_raise({:error, error}), do: raise error

  def create_id_map(items, id_key_prop, value_prop) do
    Enum.reduce(items, %{}, &Map.put(&2, Map.get(&1, id_key_prop), Map.get(&1, value_prop)))
  end

  def create_id_map(items, id_key_prop) do
    Enum.reduce(items, %{}, &Map.put(&2, Map.get(&1, id_key_prop), &1))
  end

  def wrap_ok(item), do: {:ok, item}

  def filter_not_nil(values), do: Enum.filter(values, &(!is_nil(&1)))

  def atom_matches?(atom, regex), do: Regex.match?(regex, Atom.to_string(atom))

  def get_in_schema_struct(model, path) do
    Enum.reduce(path, model, &Map.get(&2, &1, %{}))
  end

  def get_in_schema_struct(model, path, default) do
    get_in_schema_struct(model, path) || default
  end

  @spec pluck(input :: list, key :: atom|String.t) :: list
  def pluck(list, key), do: Enum.map(list, &Map.get(&1, key))

  @spec pluck_path(input :: list, props_path :: list) :: list
  def pluck_path(list, props_path) do
    Enum.map(list, fn item ->
      Enum.reduce(props_path, item, fn key, acc ->
        Map.get(acc, key, nil)
      end)
    end)
  end

  def map_values(items, function) do
    items
      |> Map.to_list
      |> Enum.map(fn {key, value} -> {key, function.(value)} end)
      |> Map.new
  end

  @spec flatten_values(map) :: list
  def flatten_values(map), do: Map.values(map) |> List.flatten

  @spec uniq_list(Enum.t, Enum.t) :: Enum.t
  def uniq_list(list1, list2) do
    MapSet.union(MapSet.new(list1), MapSet.new(list2))
      |> Enum.to_list
  end

  @spec difference(Enum.t, Enum.t) :: Enum.t
  def difference(list1, list2) do
    MapSet.difference(MapSet.new(list1), MapSet.new(list2))
      |> Enum.to_list
  end

  def fetch_changeset_params(changeset, key) when is_atom(key), do: fetch_changeset_params(changeset, Atom.to_string(key))
  def fetch_changeset_params(changeset, key) do
    case changeset.params[key] do
      nil -> :error
      value -> {:ok, value}
    end
  end

  def fetch_changeset_field(changeset, field) do
    case Ecto.Changeset.fetch_field(changeset, field) do
      {:changes, data} -> {:ok, data}
      {:data, data} -> {:ok, data}
      :error -> :error
    end
  end

  def get_first_error(values) do
    res = Enum.find(values, fn
      {:error, _} -> true
      _ -> false
    end)

    case res do
      nil -> {:ok, values}
      {:error, e} -> {:error, e}
    end
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

  @spec merge_map_total(map1 :: map, map2 :: map) :: map
  def merge_map_total(map1, map2), do: Map.merge(map1, map2, fn
    _k, v1 = %Decimal{}, v2 = %Decimal{} -> Decimal.add(v1, v2)
    _k, v1, v2 ->
      cond do
        Decimal.decimal?(v1) -> Decimal.add(Decimal.new(v2), v1)
        Decimal.decimal?(v2) -> Decimal.add(Decimal.new(v1), v2)
        true -> v1 + v2
      end
  end)

  @spec join_atoms(atom, atom) :: atom
  def join_atoms(atom1, atom2), do: safe_atom(Atom.to_string(atom1) <> "_" <> Atom.to_string(atom2))

  @spec compact(list) :: list
  def compact(list), do: Enum.filter(list, &(&1 !== nil))

  def map_keys(map, function) do
    map
      |> Map.to_list
      |> Enum.map(fn {key, value} -> {function.(key), value} end)
      |> Map.new
  end

  @spec merge_all(list) :: map
  def merge_all(list) do
    Enum.reduce(list, %{}, &Map.merge/2)
  end

  def atomize_keys(map) do
    map_keys(map, fn
      key when is_bitstring(key) -> String.to_atom(key)
      key -> key
    end)
  end

  def add_timestamps(hero) do
    Map.put(hero, :inserted_at, DateTime.utc_now)
      |> Map.put(:updated_at, DateTime.utc_now)
  end
end
