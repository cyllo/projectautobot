defmodule Models.Blog.PostCategory do
  use Models.Model
  alias Models.Blog.PostCategory

  schema "blog_post_categories" do
    belongs_to :blog_post, Models.Blog.Post
    belongs_to :blog_category, Models.Blog.Category
  end

  @required_fields [:blog_post_id, :blog_category_id]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%PostCategory{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> assoc_constraint(:blog_post, message: "You must provide a post_id")
      |> assoc_constraint(:blog_category, message: "You must provide a blog_category_id")
  end

  def create_changeset(params), do: changeset(%PostCategory{}, params)
end
