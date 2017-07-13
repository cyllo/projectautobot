defmodule Api.SessionResolver do
  alias Models.Accounts
  alias Api.{JWTGenerator, UserSessionTracker}

  def login(%{email: email, password: password}, _info) do
    with {:ok, user} <- Accounts.find_user_and_confirm_password(email, password),
         {token, exp} <- JWTGenerator.generate_token_for_user(user),
         :ok <- UserSessionTracker.activate_session(user.id, token) do
      current_session = %{
        user: user,
        session_info: %{exp: exp, token: token}
      }

      {:ok, current_session}
    end
  end

  def logout(_args, %{context: %{current_user: %{id: id}}}) do
    if UserSessionTracker.destroy_session(id) === :ok do
      {:ok, %{logged_out: true}}
    else
      {:error, "error destroying session"}
    end
  end
end
