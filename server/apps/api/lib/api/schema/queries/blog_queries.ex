defmodule Api.Schema.Queries.BlogQueries do
  use Absinthe.Schema.Notation

  alias Api.BlogResolver

  object :blog_queries do
    field :blog_post, :blog_post do
      arg :id, :integer
      arg :title, :string
      arg :is_featured, :boolean

      resolve &BlogResolver.find/2
    end

    field :blog_categories, list_of(:blog_category) do
      resolve &BlogResolver.all_categories/2
    end

    field :blog_posts, list_of(:blog_post) do
      arg :after, :integer
      arg :before, :integer
      arg :last, :integer
      arg :first, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime
      arg :ids, list_of(:integer)
      arg :is_featured, :boolean
      arg :blog_categories, list_of(non_null(:blog_category_input))

      resolve &BlogResolver.all/2
    end
  end
end
