defmodule Models.Accounts.Friendship do
  use Models.Model
  alias Models.Accounts.User

  schema "friendships" do
    field :is_accepted, :boolean, default: false
    belongs_to :user, User
    belongs_to :friend, User

    timestamps()
  end
end
