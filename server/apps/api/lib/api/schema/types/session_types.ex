defmodule Api.Schema.SessionTypes do
  use Absinthe.Schema.Notation

  object :session_info do
    field :token, :string
    field :exp, :naive_datetime
  end

  object :current_session do
    field :session_info, :session_info
    field :user, :user
  end

  object :logout_info do
    field :response, :boolean
  end
end
