defmodule Models.Blog.Post do
  use Models.Model
  alias Models.Blog.{Post, Category}
  alias Models.Blog

  schema "blog_posts" do
    field :title, :string
    field :content, :string
    field :summary, :string
    field :thumbnail_url, :string
    belongs_to :author, Models.Accounts.User
    many_to_many :blog_categories, Models.Blog.Category, join_through: "blog_post_categories",
                                                         join_keys: [blog_post_id: :id, blog_category_id: :id]

    timestamps()
  end

  @required_fields [:title, :content, :summary, :thumbnail_url, :author_id]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Post{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:title, name: :blog_post_title_index)
      |> cast_assoc(:author)
      |> cast_assoc(:blog_categories, required: true, required_message: "You must set at least one category")
      |> assoc_constraint(:author, message: "You must provide an author")
      |> put_existing_categories
  end

  def create_changeset(params), do: changeset(%Post{}, params)

  defp put_existing_categories(changeset) do
    with {:ok, blog_categories_changesets} <- fetch_change(changeset, :blog_categories) do
      categories = Enum.map(blog_categories_changesets, fn
        category -> find_or_changeset_category(category)
      end)

      put_assoc(changeset, :blog_categories, categories)
    else
      _ -> changeset
    end
  end

  defp find_or_changeset_category(category) do
    with {:ok, category} <- Blog.find_category(name: get_change(category, :name)) do
      category
    else
      {:error, _} -> category
    end
  end
end
