defmodule Api.Schema.Queries.HeroQueries do
  use Absinthe.Schema.Notation

  alias Api.HeroResolver

  object :hero_queries do
    field :hero, :hero do
      arg :id, :integer
      arg :name, :string
      arg :code, :string

      resolve &HeroResolver.find/2
    end

    field :heroes, list_of(:hero) do
      arg :ids, list_of(:integer)

      resolve &HeroResolver.all/2
    end
  end
end
