defmodule Api.Schema.ScalarTypes do
  use Absinthe.Schema.Notation

  defmacro timestamp_types do
    quote do
      field :inserted_at, :naive_datetime
      field :updated_at, :naive_datetime
    end
  end

  scalar :map, description: "JSON(b) type" do
    parse &ProperCase.to_snake_case(Map.get(&1, :value))
    serialize &ProperCase.to_camel_case/1
  end

  scalar :decimal, description: "Decimal precision 2 type" do
    serialize &Decimal.round(&1, 2)
  end
end
