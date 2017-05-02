defmodule Api.SessionResolver do
  alias Models.Accounts
  alias Api.JWTGenerator

  def login(%{identifier: identifier, password: password}, _info) do
    with {:ok, user} <- Accounts.find_user_and_confirm_password(identifier, password),
         {token, exp} <- JWTGenerator.generate_token_for_user(user) do
      current_session = %{
        user: user,
        session_info: %{exp: exp, token: token}
      }

      {:ok, current_session}
    end
  end
end
