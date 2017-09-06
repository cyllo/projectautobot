defmodule Models.Accounts.Friendship do
  use Models.Model

  alias Ecto.Multi
  alias Models.{Repo, Accounts, Game.GamerTag}
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
      |> foreign_key_constraint(:primary_gamer_tag_id, message: "primary gamer tag id doesn't exist")
      |> validate_primary_gamer_tag_is_friends_gamer_tag
  end

  def create_changeset(params), do: changeset(%Friendship{}, params)

  def reduce_params_to_query(query, params, users) when is_map(params), do: reduce_params_to_query(query, Map.to_list(params), users)
  def reduce_params_to_query(query, params, users), do: Enum.reduce(params, query, &params_to_query(&1, &2, users))

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

  def create_friendship_query(%User{} = user, %User{} = friend) do
    %{gamer_tags: user_gamer_tags} = Repo.preload(user, :gamer_tags)
    %{gamer_tags: friend_gamer_tags} = Repo.preload(friend, :gamer_tags)

    user_params = %{
      user_id: user.id, friend_id: friend.id,
      is_sender: true, primary_gamer_tag_id: get_first_gamer_tag_id(friend_gamer_tags)
    }

    friend_params = %{
      user_id: friend.id, friend_id: user.id,
      primary_gamer_tag_id: get_first_gamer_tag_id(user_gamer_tags)
    }

    create_friendship_multi(user_params, friend_params)
  end

  def create_friendship_query(user_id, friend_id) do
    user = %{user_id: user_id, friend_id: friend_id, is_sender: true}
    friend = %{user_id: friend_id, friend_id: user_id}

    create_friendship_multi(user, friend)
  end

  def create_friendship_multi(user_friendship_params, friend_friendship_params) do
      Multi.new
        |> Multi.insert(:user_friendship, struct(Friendship, user_friendship_params))
        |> Multi.insert(:friend_friendship, struct(Friendship, friend_friendship_params))
  end

  def accept_friendship_query(user_friendship, friend_friendship) do
    Multi.new
      |> Multi.update(:friendship_user, changeset(user_friendship, %{is_accepted: true}))
      |> Multi.update(:friendship_friend, changeset(friend_friendship, %{is_accepted: true}))
  end

  defp validate_primary_gamer_tag_is_friends_gamer_tag(changeset) do
    validate_change(changeset, :primary_gamer_tag_id, fn _, gamer_tag_id ->
      with {:ok, friend} <- Ecto.Changeset.get_field(changeset, :friend_id) |> Accounts.get_user(:gamer_tags),
           :ok <- Accounts.check_gamer_tag_belongs_to(friend, gamer_tag_id) do
        []
      else
        {:error, e} ->
          [primary_gamer_tag_id: e]
      end
    end)
  end

  defp get_first_gamer_tag_id(gamer_tags) do
    case List.first(gamer_tags) do
      nil -> nil
      gamer_tag -> Map.get(gamer_tag, :id)
    end
  end

  defp params_to_query({:is_accepted, value}, query, _), do: where(query, is_accepted: ^value)
  defp params_to_query({:is_sender, value}, query, _), do: where(query, is_sender: ^value)
end
