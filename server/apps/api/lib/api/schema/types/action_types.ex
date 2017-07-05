defmodule Api.Schema.ActionTypes do
  use Absinthe.Schema.Notation

  object :deleted_info do
    field :deleted, :boolean
  end
end
