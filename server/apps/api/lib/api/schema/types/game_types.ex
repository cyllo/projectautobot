defmodule Api.Schema.GameTypes do
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]
  alias Api.{SnapshotStatisticResolver, GamerTagResolver, HeroResolver}

  @desc "A gamer tag profile that's region/platform specific"
  object :gamer_tag do
    field :id, :integer

    field :tag, :string

    field :user_id, :integer
    field :overwatch_name, :string
    field :portrait_url, :string

    field :region, :string
    field :platform, :string

    timestamp_types

    field :user, :user do
      resolve fn gamer_tag, _, _ ->
        batch(
          {GamerTagResolver, :get_gamer_tags_user},
          gamer_tag,
          &{:ok, Map.get(&1, gamer_tag.id)}
        )
      end
    end

    field :snapshot_statistics, list_of(:snapshot_statistic) do
      arg :first, :integer
      arg :last, :integer
      arg :start_date, :datetime
      arg :end_date, :datetime
      arg :after, :integer
      arg :before, :integer
      arg :only_last_daily, :boolean

      resolve fn gamer_tag, args, _ ->
        batch(
          {SnapshotStatisticResolver, :get_gamer_tag_snapshot_statistics, args},
          gamer_tag.id,
          &{:ok, Map.get(&1, gamer_tag.id, [])}
        )
      end
    end

    field :connected_gamer_tags, list_of(:gamer_tag) do
      resolve fn gamer_tag, _args, _ ->
        batch(
          {GamerTagResolver, :get_gamer_tag_connected_gamer_tags},
          gamer_tag,
          &{:ok, Map.get(&1, gamer_tag.id, [])}
        )
      end
    end

    field :following_users, list_of(:user) do
      resolve fn gamer_tag, _args, _ ->
        batch(
          {GamerTagResolver, :get_gamer_tag_following_users},
          gamer_tag.id,
          &{:ok, Map.get(&1, gamer_tag.id, [])}
        )
      end
    end
  end

  @desc "Status of a gamer tag being watched"
  object :gamer_tag_watch_status do
    field :gamer_tag, :gamer_tag
    field :is_watched, :boolean
  end

  object :hero_role do
    field :id, :integer
    field :name, :string
    field :svg_url, :string
  end

  object :hero_skill do
    field :id, :integer
    field :name, :string
    field :description, :string
    field :icon_url, :string
  end

  @desc "Overwatch heroes"
  object :hero do
    field :id, :integer
    field :name, :string
    field :description, :string
    field :icon_portrait_url, :string
    field :select_portrait_url, :string

    field :role, :hero_role do
      resolve fn hero, _args, _ ->
        batch(
          {HeroResolver, :get_hero_roles},
          hero,
          &{:ok, Map.get(&1, hero.id, [])}
        )
      end
    end

    field :skills, list_of(:hero_skill) do
      resolve fn hero, _args, _ ->
        batch(
          {HeroResolver, :get_hero_skills},
          hero,
          &{:ok, Map.get(&1, hero.id, [])}
        )
      end
    end

    timestamp_types
  end
end
