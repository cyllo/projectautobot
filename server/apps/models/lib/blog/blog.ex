defmodule Models.Blog do
  use Models.Model
  alias Models.Model
  alias Models.Blog.{Post, Category}
  alias Models.Repo

  def get_all_posts(%{gamer_tag_ids: gamer_tag_ids} = params) do
    from(p in Post, where: p.gamer_tag_id in ^gamer_tag_ids)
      |> Model.create_model_filters(params)
      |> Repo.all
  end

  def find_post(%{title: title}) do
    case from(p in Post, where: fragment("lower(?)", p.title) == ^String.downcase(title)) |> Repo.one do
      nil -> {:error, "post with title \"#{title}\" not found"}
      post -> {:ok, post}
    end
  end

  Models.Model.create_model_methods(Post)
  Models.Model.create_model_methods(Category)

  def create_post(params) do
    params
      |> Post.create_changeset
      |> Repo.insert
  end

  def delete_post(id) do
    Repo.get!(Post, id)
      |> Repo.delete
  end
end
