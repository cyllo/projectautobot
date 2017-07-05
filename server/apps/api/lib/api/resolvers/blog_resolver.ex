defmodule Api.BlogResolver do
  alias Models.Blog

  def all(params, _info) when is_map(params), do: {:ok, Blog.get_all_posts(params)}
  def all(_, _info), do: {:ok, Blog.get_all_posts()}

  def find(params, _info), do: Blog.find_post(params)
  def create(%{content: content, title: title}, _info), do: Blog.create_post(title, content)
  def update(params, _info), do: Blog.update_post(params.id, Map.take(params, [:content, :title]))

  def delete(%{id: id}, _info) do
    with {:ok, _} <- Blog.delete_post(id) do
      {:ok, %{deleted: true}}
    end
  end
end
