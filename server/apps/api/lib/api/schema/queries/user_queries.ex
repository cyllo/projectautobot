defmodule Api.Schema.Queries.UserQueries do
  use Absinthe.Schema.Notation

  alias Api.{Middleware, UserResolver}

  object :user_queries do
    @desc """
      Gets current User when logged in

      Restrictions: User Auth
    """
    field :me, :user do
      middleware Middleware.Auth
      resolve &UserResolver.current/2
    end

    field :user, :user do
      arg :id, :integer
      arg :identifier, :string
      arg :email, :string
      arg :username, :string

      resolve &UserResolver.find/2
    end

    field :users, list_of(:user) do
      arg :ids, list_of(:integer)
      arg :search, :string

      resolve &UserResolver.all/2
    end
  end
end
