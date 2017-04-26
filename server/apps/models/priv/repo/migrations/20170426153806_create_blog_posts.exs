defmodule Models.Repo.Migrations.CreateBlogPosts do
  use Ecto.Migration

  def change do
    create table(:blog_posts) do
      add :title, :text
      add :content, :text

      timestamps
    end
  end
end
