defmodule Api.Schema.ScalarTypes do
  defmacro timestamp_types do
    quote do
      field :inserted_at, :time
      field :updated_at, :time
    end
  end
end
