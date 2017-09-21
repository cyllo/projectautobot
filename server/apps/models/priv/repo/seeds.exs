import Logger, only: [info: 1]
require Ecto.Query

alias Ecto.{Multi, Query}
alias Models.{Repo, Accounts}
alias Models.{Game, Accounts}
alias Models.Accounts.{Friendship, User}
alias Models.Game.GamerTag

get_first_gamer_tag = fn user_id ->
  Query.from(GamerTag, where: [id: ^user_id])
    |> Query.first
    |> Repo.one
    |> Map.get(:id)
end

create_friendship_query = fn query, user_id, friend_id ->
  user = %Friendship{
    user_id: user_id,
    friend_id: friend_id,
    primary_gamer_tag_id: get_first_gamer_tag.(friend_id),
    is_sender: true
  }

  friend = %Friendship{
    user_id: friend_id,
    friend_id: user_id,
    primary_gamer_tag_id: get_first_gamer_tag.(user_id)
  }

  query
    |> Multi.insert(:"user_friendship_#{user_id}_#{friend_id}", user)
    |> Multi.insert(:"friend_friendship_#{user_id}_#{friend_id}", friend)
end

users = [%{
  display_name: "Tim",
  email: "tim@gmail.com",
  battle_net_tag: "Caymus#11831",
  battle_net_id: 12312312,
  password: "P@ssword1"
}, %{
  display_name: "Bob",
  battle_net_tag: "Seagull-1894",
  battle_net_id: 212312,
  email: "bob@gmail.com",
  password: "P@ssword1"
}, %{
  display_name: "Chad",
  battle_net_tag: "DabbyDabDab#1225",
  battle_net_id: 32423,
  email: "chad@gmail.com",
  password: "P@ssword1"
}, %{
  display_name: "Nick",
  battle_net_tag: "nvvy#1132",
  battle_net_id: 2123188,
  email: "nick@gmail.com",
  password: "P@ssword1"
}, %{
  display_name: "Kurt",
  email: "kurt@gmail.com",
  battle_net_tag: "cyllo#2112",
  battle_net_id: 21231218,
  password: "P@ssword1"
}, %{
  display_name: "Mika",
  email: "mika@gmail.com",
  battle_net_tag: "TeaMaster#11555",
  battle_net_id: 2123187,
  password: "P@ssword1"
}]

gamer_tags = [%{
  tag: "Caymus#11831",
  platform: "pc",
  region: "us",
  user_id: 1
}, %{
  tag: "Seagull-1894",
  platform: "pc",
  region: "us",
  user_id: 2
}, %{
  tag: "DabbyDabDabDab",
  platform: "xbl",
  region: "",
  user_id: 3
}, %{
  tag: "nvvy#1132",
  platform: "pc",
  region: "us",
  user_id: 4
}, %{
  tag: "cyllo-2112",
  platform: "pc",
  region: "us",
  user_id: 5
}, %{
  tag: "TeaMaster-11555",
  region: "us",
  platform: "pc",
  user_id: 6
}]


info "Creating Users..."

users = for user <- users do
  {:ok, user} = Accounts.create_user(user)

  user
end

info "Creating GamerTags..."

gamer_tags = for gamer_tag <- gamer_tags do
  {:ok, gamer_tag} = Game.create_gamer_tag(gamer_tag)

  Accounts.update_user(gamer_tag.user_id, %{primary_gamer_tag_id: gamer_tag.id})
  gamer_tag
end

gamer_tags = Task.async(fn -> Scraper.scrape_gamer_tags(gamer_tags) end)

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

Task.await(gamer_tags, 60_000)
