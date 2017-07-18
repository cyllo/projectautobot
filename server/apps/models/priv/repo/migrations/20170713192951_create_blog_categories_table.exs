defmodule Models.Repo.Migrations.CreateBlogCategoriesTable do
  use Ecto.Migration

  def change do
    create table(:blog_categories) do
      add :name, :text, limit: 100, null: false
    end

    create unique_index(:blog_categories, [:name])
  end
end
