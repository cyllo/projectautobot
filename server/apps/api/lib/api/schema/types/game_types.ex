defmodule Api.Schema.GameTypes do
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]
  alias Api.{SnapshotStatisticResolver, GamerTagResolver}

  @desc "A gamer tag profile that's region/platform specific"
  object :gamer_tag do
    field :id, :integer

    field :tag, :string
    field :user_id, :integer
    field :overwatch_name, :string
    field :portrait_url, :string
    field :total_games_won, :integer

    field :competitive_level, :integer
    field :competitive_rank_url, :string

    field :region, :string
    field :platform, :string

    field :level, :integer
    field :level_url, :string
    field :rank_url, :string

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
      arg :is_competitive, :boolean

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

  @desc "Overwatch heroes"
  object :hero do
    field :id, :integer
    field :name, :string
    field :code, :string

    timestamp_types
  end
end
