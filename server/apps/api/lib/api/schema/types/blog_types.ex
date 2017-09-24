defmodule Api.Schema.BlogTypes do
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]
  alias Api.BlogResolver

  object :blog_post do
    field :id, :integer
    field :title, :string
    field :content, :string
    field :summary, :string
    field :is_featured, :boolean
    field :thumbnail_url, :string
    field :hero_image_url, :string

    field :author, :user do
      resolve fn blog_post, _, _ ->
        batch(
          {BlogResolver, :get_authors_by_post_ids},
          blog_post,
          &{:ok, Map.get(&1, blog_post.id)}
        )
      end
    end

    field :blog_categories, list_of(:blog_category) do
      resolve fn blog_post, _, _ ->
        batch(
          {BlogResolver, :get_categories_by_post_ids},
          blog_post,
          &{:ok, Map.get(&1, blog_post.id, [])}
        )
      end
    end

    timestamp_types
  end

  object :blog_category do
    field :id, :integer
    field :name, :string
  end

  input_object :blog_category_input do
    field :id, :integer
    field :name, :string
  end
end
