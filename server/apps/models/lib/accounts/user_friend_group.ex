defmodule Models.Accounts.UserFriendGroup do
  use Models.Model
  alias Models.Accounts
  alias Models.Accounts.{User, UserFriendGroup, Friendship}

  schema "user_friend_groups" do
    field :name, :string
    belongs_to :user, User
    many_to_many :friendships, Friendship, join_through: "user_friend_group_friendships"

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
      |> cast_assoc(:user, required: true, message: "You must provide a user for this friend group")
      |> put_friendships
  end

  def create_changeset(params), do: changeset(%UserFriendGroup{}, params)

  defp put_friendships(changeset) do
    with {:ok, friendships} <- fetch_change(changeset, :friendships),
         {:ok, friendships} <- get_friendships(changeset, friendships) do

      put_assoc(changeset, :friendships, friendships)
    else
      {:error, %Ecto.Changeset{} = change} -> change
      {:error, _} -> changeset
    end
  end

  defp get_friendships(changeset, friendships), do: friendships |> Enum.group_by(fn
    %Friendship{} -> :friendships
    %User{} -> :users
  end) |> get_grouped_friendships(changeset)

  defp get_grouped_friendships(friendship_groups, changeset) do
    friendship_groups
      |> Enum.map(fn
        {:friendships, friendships} -> Enum.map(friendships, &load_friendship/1)
        {:users, users} -> Enum.map(users, &load_user/1)
      end)
  end

  defp load_user(%User{id: _} = user), do: user
  defp load_user(params) do
    with {:ok, user} <- Accounts.find_user(params) do
      user
    end
  end

  defp load_friendship(%Friendship{id: _} = friendship), do: friendship
  defp load_friendship(%Friendship{user: user, friend: friend}), do: load_friendship(%Friendship{user: user, friend_id: friend.id})
  defp load_friendship(%Friendship{user: user, friend_id: friend_id}) do
    with {:ok, friendship} <- Models.Accounts.get_user_friendship(user.id, friend_id) do
      friendship
    end
  end
end
