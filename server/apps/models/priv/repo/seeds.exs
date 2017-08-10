import Logger, only: [info: 1]

alias Ecto.Multi
alias Models.{Repo, Accounts}
alias Models.Accounts.{Friendship, User}

create_friendship_query = fn query, user_id, friend_id ->
  user = %Friendship{user_id: user_id, friend_id: friend_id, is_sender: true}
  friend = %Friendship{user_id: friend_id, friend_id: user_id}

  query
    |> Multi.insert(:"user_friendship_#{user_id}_#{friend_id}", user)
    |> Multi.insert(:"friend_friendship_#{user_id}_#{friend_id}", friend)
end

users = [%{
  display_name: "Tim",
  email: "tim@gmail.com",
  password: "password"
}, %{
  display_name: "Bob",
  email: "bob@gmail.com",
  password: "password"
}, %{
  display_name: "Chad",
  email: "chad@gmail.com",
  password: "password"
}, %{
  display_name: "Nick",
  email: "nick@gmail.com",
  password: "password"
}, %{
  display_name: "Kurt",
  email: "kurt@gmail.com",
  password: "password"
}, %{
  display_name: "Mika",
  email: "mika@gmail.com",
  password: "password"
}]

# Create Users
info "Creating Users..."

users = for user <- users do
  {:ok, user} = Accounts.create_user(user)

  user
end

# Create Friends
info "Creating Friends..."

users
  |> Enum.with_index
  |> Enum.reduce(Multi.new(), fn {user, index}, query ->
    users
      |> Enum.drop(index + 1)
      |> Enum.reduce(query, &create_friendship_query.(&2, user.id, &1.id))
  end)
  |> Multi.update_all(:accept_friendships, Friendship, set: [is_accepted: true])
  |> Repo.transaction

# Create FriendGroups
info "Creating Friend Groups..."

users
  |> Enum.with_index
  |> Enum.reduce(Multi.new(), fn {user, index}, query ->
    {_, rest_users} = users
      |> List.pop_at(index)

    friendships = Enum.map(rest_users, &(%{friend_user_id: &1.id}))

    Accounts.create_user_friend_group(user, %{
      name: "General",
      friendships: friendships
    })
  end)
