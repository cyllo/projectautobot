defmodule Api.BlogResolver do
  alias Models.Blog

  def all(params, _info) when is_map(params), do: {:ok, Blog.get_all_posts(params)}
  def all(_, _info), do: {:ok, Blog.get_all_posts()}

  def find(params, _info), do: Blog.find_post(params)
  def create(%{content: content, title: title}, _info), do: Blog.create_post(title, content)
end
