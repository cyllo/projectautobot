defmodule Models.Accounts.Friendship do
  use Models.Model
  alias Ecto.Multi
  alias Models.Game.GamerTag
  alias Models.Accounts.{User, Friendship, UserFriendGroup}

  schema "friendships" do
    field :is_accepted, :boolean, default: false
    field :is_sender, :boolean, default: false
    belongs_to :primary_gamer_tag, GamerTag
    belongs_to :user, User
    belongs_to :friend, User
    many_to_many :user_friend_groups, UserFriendGroup, join_through: "user_friend_group_friendships",
                                                       on_delete: :delete_all

    timestamps(type: :utc_datetime)
  end

  @allowed_fields [:primary_gamer_tag_id, :is_accepted, :is_sender]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Friendship{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> foreign_key_constraint(:primary_gamer_tag_id)
  end

  def create_changeset(params), do: changeset(%Friendship{}, params)

  def reduce_params_to_query(query, params, users) when is_map(params), do: reduce_params_to_query(query, Map.to_list(params), users)
  def reduce_params_to_query(query, params, users) do
    if Keyword.has_key?(params, :is_incoming) do
      {_, rest_params} = Keyword.pop_first(params, :is_incoming)

      Enum.reduce(
        rest_params,
        params_to_query({:is_incoming, Keyword.get(params, :is_incoming)}, query, users),
        &params_to_query(&1, &2, users)
      )
    else
      Enum.reduce(params, query, &params_to_query(&1, &2, users))
    end
  end

  def get_users_friendships_query(user_ids) do
    from(f in Friendship, where: f.user_id in ^user_ids,
                          preload: [:user, :friend])
  end

  def find_frindship_by_id_query(friendship_ids) do
    from(f in Friendship, where: f.id in ^friendship_ids)
  end

  def get_user_any_friendship_query(user_1_id, user_2_id) do
    from(f in Friendship, where: [user_id: ^user_1_id, friend_id: ^user_2_id],
                          or_where: [user_id: ^user_2_id, friend_id: ^user_1_id])
  end

  def find_friendship_query(user_id, friend_id) do
    from(f in Friendship, where: [user_id: ^user_id, friend_id: ^friend_id])
  end

  def create_friendship_query(user_id, friend_id) do
    user = %Friendship{user_id: user_id, friend_id: friend_id, is_sender: true}
    friend = %Friendship{user_id: friend_id, friend_id: user_id}

    Multi.new
      |> Multi.insert(:user_friendship, user)
      |> Multi.insert(:friend_friendship, friend)
  end

  def accept_friendship_query(user_friendship, friend_friendship) do
    Multi.new
      |> Multi.update(:friendship_user, changeset(user_friendship, %{is_accepted: true}))
      |> Multi.update(:friendship_friend, changeset(friend_friendship, %{is_accepted: true}))
  end

  defp params_to_query({:is_accepted, value}, query, _), do: where(query, is_accepted: ^value)
  defp params_to_query({:is_incoming, false}, query, users), do: query
  defp params_to_query({:is_incoming, true}, query, users) do
    query
      |> exclude(:where)
      |> where([u], u.user_id in ^Utility.pluck(users, :id))
      |> where(is_accepted: false, is_sender: false)
  end
end
