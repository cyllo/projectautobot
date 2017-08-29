defmodule Api.BlogResolver do
  alias Models.Blog
  import Api.Helpers, only: [preload_id_map: 3, preload_id_map: 2]

  def all(params, _info) when params == %{}, do: {:ok, Blog.get_all_posts()}
  def all(params, _info), do: {:ok, Blog.get_all_posts(params)}

  def all_categories(_, _), do: {:ok, Blog.get_all_categorys()}

  def find(params, _info), do: Blog.find_post(params)
  def create(params, %{context: %{current_user: %{id: id}}}), do: params |> Map.put(:author_id, id) |> Blog.create_post
  def update(params, _info), do: Blog.update_post(params.id, params)

  def delete(%{id: id}, _info) do
    with {:ok, _} <- Blog.delete_post(id) do
      {:ok, %{deleted: true}}
    end
  end

  def get_authors_by_post_ids(_, posts), do: preload_id_map(posts, :author)
  def get_categories_by_post_ids(_, posts), do: preload_id_map(posts, :blog_categories, [])
end
