defmodule Api.SessionResolver do
  alias Models.Accounts

  def login(%{identifier: identifier, password: password}, _info) do
    with {:ok, user} <- Models.Accounts.find_user_and_confirm_password(identifier, password),
         %{exp: exp, token: token} <- Api.JWTGenerator.generate_token_fo_user(user) do

      %{
        user: user,
        session_info: %{exp: exp, token: token}
      }
    end
  end
end
