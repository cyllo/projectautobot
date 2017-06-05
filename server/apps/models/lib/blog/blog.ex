defmodule Models.Blog do
  use Models.Model
  alias Models.Blog.Post
  alias Models.Repo

  def get_all_posts(%{last: limit} = params) do
    params = Map.delete(params, :last)

    from(p in Post, order_by: [desc: p.inserted_at], limit: ^limit, where: ^Map.to_list(params))
      |> Repo.all
      |> Enum.reverse
  end

  Models.Model.create_model_methods(Post)

  def create_post(title, content) do
    %{title: title, content: content}
      |> Post.create_changeset
      |> Repo.insert
  end
end
