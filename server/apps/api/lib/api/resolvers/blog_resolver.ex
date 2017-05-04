defmodule Api.BlogResolver do
  alias Models.Blog

  def all(%{}, _info), do: {:ok, Blog.get_all_posts()}
  def all(params, _info), do: {:ok, Blog.get_all_posts(params)}
  def find(params, _info), do: Blog.find_post(params)
  def create(%{content: content, title: title}, _info), do: Blog.create_post(title, content)
end
