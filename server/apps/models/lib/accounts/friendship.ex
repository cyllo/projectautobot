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

  def reduce_params_to_query(query, params), do: Enum.reduce(params, query, &params_to_query/2)
  def params_to_query({:is_accepted, value}, query), do: where(query, is_accepted: ^value)
  def params_to_query({:is_incoming, value}, query) do
    import IEx
    IEx.pry
    query
  end
  def params_to_query(_, query), do: query
end
