defmodule Models.Repo.Migrations.CreateBlogPostCategoriesTable do
  use Ecto.Migration

  def change do
    create table(:blog_post_categories, primary_key: false) do
      add :blog_post_id, references(:blog_posts), primary_key: true, null: false
      add :blog_category_id, references(:blog_categories), primary_key: true, null: false
    end

    create index(:blog_post_categories, [:blog_post_id])
    create index(:blog_post_categories, [:blog_category_id])
  end
end
