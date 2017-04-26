defmodule Models.Blog do
  use Models.Model
  alias Models.Blog.Post
  alias Models.Repo

  Models.Model.create_model_methods(Post)

  def create_post(title, content) do
    %{title: title, content: content}
      |> Post.create_changeset
      |> Repo.insert
  end
end
