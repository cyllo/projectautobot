defmodule Api.Schema.AccountTypes do
  use Absinthe.Schema.Notation
  import Api.Schema.ScalarTypes, only: [timestamp_types: 0]

  @desc "A user object for an account which owns gamer tags"
  object :user do
    field :id, :integer
    field :username, :string
    field :email, :string
    timestamp_types
  end

  @desc "Friendships 1 <=> 1 for user"
  object :friendship do
    field :id, :integer
    field :is_accepted, :boolean
    field :user, :user
    field :friend, :user
    timestamp_types
  end

  @desc "followers 1 => 1 for user"
  object :following_result do
    field :following, :user
    field :user, :user
    timestamp_types
  end
end
