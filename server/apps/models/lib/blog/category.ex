defmodule Models.Blog.Category do
  use Models.Model
  alias Models.Blog.Category

  schema "blog_categories" do
    field :name, :string
  end

  @required_fields [:name]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Category{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> unique_constraint(:name, name: :blog_categories_name_index)
  end

  def create_changeset(params), do: changeset(%Category{}, params)
end
