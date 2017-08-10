defmodule Models.Repo.Migrations.CreateBlogPosts do
  use Ecto.Migration

  def change do
    create table(:blog_posts) do
      add :title, :text, null: false
      add :content, :text, null: false
      add :summary, :text, null: false
      add :thumbnail_url, :text, null: false
      add :hero_image_url, :text, null: false
      add :author_id, references(:users), null: false

      timestamps(type: :utc_datetime)
    end


    create unique_index(:blog_posts, [:title], name: :blog_post_title_index)
  end
end
