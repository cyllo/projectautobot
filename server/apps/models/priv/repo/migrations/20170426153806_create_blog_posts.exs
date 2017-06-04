defmodule Models.Repo.Migrations.CreateBlogPosts do
  use Ecto.Migration

  def change do
    create table(:blog_posts) do
      add :title, :text, null: false
      add :content, :text, null: false

      timestamps()
    end


    create unique_index(:blog_posts, [:title], name: :blog_post_title_index)
  end
end
