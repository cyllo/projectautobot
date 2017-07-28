defmodule Models.Accounts.UserFriendGroupFriendship do
  use Models.Model
  alias Models.Accounts
  # alias Models.Accounts.{User, UserFriendGroup, Friendship}

  @primary_key false

  schema "user_friend_group_friendships" do
    belongs_to :user_friend_group, Accounts.UserFriendGroup
    belongs_to :friendship, Accounts.Friendship
  end
end
