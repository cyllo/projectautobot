defmodule Api.Schema.SessionTypes do
  use Absinthe.Schema.Notation

  object :session_info do
    field :token, :string
    field :exp, :naive_datetime
  end

  union :current_session do
    types [:user, :session_info]

    resolve_type fn
      %Models.Accounts.User{}, _ -> :user
      res, _ -> if is_session_info(res), do: :session_info, else: :error
    end
  end

  defp is_session_info(%{token: _, exp: _}), do: true
  defp is_session_info(_), do: false
end
