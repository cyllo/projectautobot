defmodule Models.Accounts.Friendship do
  use Models.Model
  alias Models.Accounts.{User, Friendship}

  schema "friendships" do
    field :is_accepted, :boolean, default: false
    belongs_to :user, User
    belongs_to :friend, User

    timestamps(type: :utc_datetime)
  end

  @allowed_fields [:is_accepted]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Friendship{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
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

  def params_to_query({:is_accepted, value}, query, _), do: where(query, is_accepted: ^value)
  def params_to_query({:is_incoming, true}, query, users) do
    query
      |> exclude(:where)
      |> where([u], u.friend_id in ^Utility.pluck(users, :id))
  end
  def params_to_query({:is_incoming, false}, query, users) do
    query
      |> exclude(:where)
      |> where([u], u.user_id in ^Utility.pluck(users, :id))
  end

  def params_to_query(_, query), do: query
end
