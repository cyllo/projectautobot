defmodule Api.Schema.ActionTypes do
  use Absinthe.Schema.Notation

  object :deleted_info do
    field :deleted, :boolean
  end

  object :removed_info do
    field :removed, :boolean
  end

  object :rejected_info do
    field :rejected, :boolean
  end
end
