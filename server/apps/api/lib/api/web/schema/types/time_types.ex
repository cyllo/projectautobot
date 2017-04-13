defmodule Api.Schema.TimeTypes do
  use Absinthe.Schema.Notation

  scalar :time, description: "ISOz time" do
    parse &deserialize_from_string(&1.value)
    serialize &serialize_to_iso_string((&1))
  end

  defp serialize_to_iso_string(naive_date_time) do
    naive_date_time
      |> DateTime.from_naive!("Etc/UTC")
      |> DateTime.to_iso8601
  end

  defp deserialize_from_string(str) do
    with {:ok, date, _} <- DateTime.from_iso8601(str) do
      DateTime.to_naive date
    else
      {:error, _} -> ""
    end
  end
end
