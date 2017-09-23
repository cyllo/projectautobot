defmodule Models.Blog.Post do
  use Models.Model
  alias Models.Blog.{Post, Category}
  alias Models.{Blog, Repo}

  schema "blog_posts" do
    field :title, :string
    field :content, :string
    field :summary, :string
    field :thumbnail_url, :string
    field :hero_image_url, :string
    field :is_featured, :boolean
    belongs_to :author, Models.Accounts.User
    many_to_many :blog_categories, Models.Blog.Category, join_through: "blog_post_categories",
                                                         join_keys: [blog_post_id: :id, blog_category_id: :id]

    timestamps(type: :utc_datetime)
  end

  @required_fields [:title, :content, :summary, :thumbnail_url, :author_id, :hero_image_url]
  @allowed_fields Enum.concat(@required_fields, [:is_featured])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Post{} = struct, params \\ %{}) do
    struct
      |> Repo.preload(:blog_categories)
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:title, name: :blog_post_title_index, message: "title must be unique")
      |> unique_constraint(:is_featured, name: :blog_post_is_featured_index, message: "can only have one featured post")
      |> cast_assoc(:author)
      |> cast_assoc(:blog_categories, required: true, required_message: "You must set at least one category")
      |> assoc_constraint(:author, message: "You must provide an author")
      |> put_existing_categories
  end

  def create_changeset(params), do: changeset(%Post{}, params)

  def create_blog_category_filter(query, %{blog_categories: categories}) do
    query
      |> join(:inner, [bp], bc in assoc(bp, :blog_categories))
      |> Ecto.Query.where([_, bc], bc.name in ^blog_category_names(categories))
  end
  def create_blog_category_filter(query, _), do: query

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

  defp blog_category_names(categories) do
    Enum.map(categories, fn
      %{name: name} -> name
      %{id: id} -> Repo.get(Category, id) |> Map.get(:name, "")
    end)
  end
end
