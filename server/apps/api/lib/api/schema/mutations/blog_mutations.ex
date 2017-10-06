defmodule Api.Schema.Mutations.BlogMutations do
  use Absinthe.Schema.Notation

  alias Api.{Middleware, BlogResolver}

  object :blog_post_mutations do
    @desc """
      Create a BlogPost

      Restrictions: Admin Only
    """
    field :create_blog_post, :blog_post do
      arg :title, non_null(:string)
      arg :content, non_null(:string)
      arg :hero_image_url, non_null(:string)
      arg :summary, non_null(:string)
      arg :thumbnail_url, non_null(:string)
      arg :is_featured, :boolean
      arg :blog_categories, non_null(list_of(non_null(:blog_category_input)))

      middleware Middleware.Auth, admin_only: true
      resolve &BlogResolver.create/2
    end

    @desc """
      Delete a BlogPost

      Restrictions: Admin Only
    """
    field :delete_blog_post, :deleted_info do
      arg :id, non_null(:integer)

      middleware Middleware.Auth, admin_only: true
      resolve &BlogResolver.delete/2
    end

    @desc """
      Update a BlogPost

      Restrictions: Admin Only
    """
    field :update_blog_post, :blog_post do
      arg :id, non_null(:integer)
      arg :title, :string
      arg :content, :string
      arg :hero_image_url, :string
      arg :summary, :string
      arg :thumbnail_url, :string

      middleware Middleware.Auth, admin_only: true
      resolve &BlogResolver.update/2
    end
  end
end
