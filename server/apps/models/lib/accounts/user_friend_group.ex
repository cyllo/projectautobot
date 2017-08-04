defmodule Models.Accounts.UserFriendGroup do
  use Models.Model
  alias Models.Accounts
  alias Models.Accounts.{User, UserFriendGroup, Friendship}

  schema "user_friend_groups" do
    field :name, :string
    belongs_to :user, User
    many_to_many :friendships, Friendship, join_through: "user_friend_group_friendships",
                                           on_delete: :delete_all

    timestamps(type: :utc_datetime)
  end

  @fields [:name]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%UserFriendGroup{} = struct, params \\ %{}) do
    struct
      |> cast(params, @fields)
      |> validate_required(@fields)
      |> unique_constraint(:name, name: :user_friend_groups_name_user_id_index, message: "You already have a group with this name")
      |> cast_assoc(:user, required: true, message: "You must provide a user for this friend group")
      |> put_friendships
  end

  def create_changeset(params), do: changeset(%UserFriendGroup{}, params)

  defp put_friendships(changeset) do
    with {:ok, friendships} <- Utility.fetch_changeset_params(changeset, :friendships),
         {:ok, friendships} <- get_friendships(changeset, friendships),
         :ok <- check_friendship_uniq(friendships),
         {:ok, user_id} <- Utility.fetch_changeset_field(changeset, :user_id),
         :ok <- check_friendships_are_users(friendships, user_id) do
      put_assoc(changeset, :friendships, friendships)
    else
      :error -> changeset
      {:error, e} -> add_error(changeset, :friendships, e)
    end
  end

  defp check_friendships_are_users(friendships, user_id) do
    case Enum.find(friendships, &(&1.user_id !== user_id)) do
      nil -> :ok
      friendship -> {:error, "You don't own friendship #{friendship.id}, it belongs to user #{friendship.user_id}"}
    end
  end

  defp check_friendship_uniq(friendships) do
    duplicate_id = friendships
      |> Enum.group_by(&(&1.id), &(&1.id))
      |> Enum.find_value(fn {id, ids} -> if length(ids) > 1, do: id, else: false end)

    case duplicate_id do
      nil -> :ok
      duplicate_id -> {:error, "Friendship id #{duplicate_id} is already in group"}
    end
  end

  defp get_friendships(changeset, friendships) do
    friendships
      |> Enum.group_by(fn
        %Friendship{} -> :friendships
        %User{} -> :users
        %{friendship_id: _} -> :friendships
        %{friend_user_id: _} -> :users
      end)
      |> get_grouped_friendships(changeset)
      |> Utility.get_first_error
  end

  defp get_grouped_friendships(friendship_groups, changeset) do
    friendship_groups
      |> Enum.reduce([], fn
        {:friendships, friendships}, acc ->
          acc ++ Enum.map(friendships, &load_friendship(&1))

        {:users, users}, acc ->
          acc ++ Enum.map(users, &load_user_friendship(&1, fetch_user_field(changeset)))
      end)
  end

  defp fetch_user_field(changeset) do
    with {:ok, user} <- Utility.fetch_changeset_field(changeset, :user) do
      user
    end
  end

  defp load_user_friendship(%User{id: _} = user, _user), do: user
  defp load_user_friendship(params, user) do
    with {:ok, {user_friendship, _}} <- Accounts.get_friendship_tuple(user, params) do
      user_friendship
    end
  end

  defp load_friendship(%Friendship{id: _} = friendship), do: friendship
  defp load_friendship(%Friendship{user: user, friend: friend}), do: load_friendship(%Friendship{user: user, friend_id: friend.id})
  defp load_friendship(%{friendship_id: id}) do
    with {:ok, friendship} <- Accounts.get_friendship(id) do
      friendship
    end
  end

  defp load_friendship(%Friendship{user: user, friend_id: friend_id}) do
    with {:ok, friendship} <- Accounts.find_user_friendship(user.id, friend_id) do
      friendship
    end
  end
end
