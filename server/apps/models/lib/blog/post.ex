defmodule Models.Blog.Post do
  use Models.Model
  alias Models.Blog.Post

  schema "blog_posts" do
    field :title, :string
    field :content, :string

    timestamps()
  end

  @required_fields [:title, :content]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Post{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:title, name: :blog_post_title_index)
  end

  def create_changeset(params), do: changeset(%Post{}, params)
end
