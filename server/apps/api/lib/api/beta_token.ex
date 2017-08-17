defmodule Api.BetaToken do
  import Plug.Conn, only: [halt: 1, delete_resp_header: 2, put_resp_header: 3, send_resp: 3]

  def basic_auth_login(conn, username, password) do
    cond do
      is_invite_code?(username) and is_invite_code?(password) ->
        delete_invite_code(username)
        delete_resp_header(conn, "authorization")

      user = login_user(username, password) ->
        %{exp: exp, token: token} = user
        put_resp_header(conn, "Set-Cookie", create_authorization_header(token, exp))

      true -> basic_auth_error(conn)
    end
  end

  def basic_auth_error(conn) do
    conn
      |> send_resp(401, "unauthorized please contact admin for a beta invite")
      |> halt()
  end

  def create_invite_code do
    code = Ecto.UUID.generate()

    with :ok <- save_invite_code(code) do
      code
    end
  end

  defp save_invite_code(code), do: ConCache.put(:beta_token_store, code, true)
  defp is_invite_code?(code), do: ConCache.get(:beta_token_store, code) || false
  defp delete_invite_code(code), do: ConCache.delete(:beta_token_store, code)

  defp create_authorization_header(token, exp) do
    "authorization=" <> "Bearer #{token}; Expires=#{format_expiry(exp)}; Secure"
  end

  defp format_expiry(exp) do
    with {:ok, exp} <- Timex.format(exp, "{WDshort}, {D} {Mshort} {YYYY} {h24}:{m}:{s} {Zabbr}") do
      exp
    else
      _ -> ""
    end
  end

  defp login_user(email, password) do
    with {:ok, current_session} <- Api.SessionResolver.login(%{email: email, password: password}, nil) do
      %{session_info: %{exp: exp, token: token}} = current_session

      %{exp: exp, token: token}
    else
      _ -> false
    end
  end
end
