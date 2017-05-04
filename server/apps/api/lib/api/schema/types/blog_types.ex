defmodule Api.Schema.BlogTypes do
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]

  object :blog_post do
    field :title, :string
    field :content, :string

    timestamp_types
  end
end
