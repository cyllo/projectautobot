defmodule Api.BetaToken do
  import Plug.Conn, only: [halt: 1, put_resp_header: 3, send_resp: 3]

  def basic_auth_login(conn, username, password) do
    cond do
      user = login_user(username, password) ->
        %{exp: exp, token: token} = user
        put_resp_header(conn, "Set-Cookie", create_authorization_header(token, exp))

      is_used_code?(username) and is_used_code?(password) -> conn

      is_invite_code?(username) and is_invite_code?(password) and is_unused_code?(username) ->
        use_invite_code(username)

        Task.start(fn ->
          Process.send_after self(), :expire, :timer.minutes(5)

          receive do
            :expire -> delete_invite_code(username)
          end
        end)

        conn

      true -> basic_auth_error(conn)
    end
  end

  def basic_auth_error(conn) do
    conn
      |> send_resp(401, "unauthorized please contact admin for a beta invite")
      |> halt()
  end

  def create_invite_codes(n) when is_bitstring(n), do: Enum.map(0..String.to_integer(n), fn _ -> create_invite_code() end)
  def create_invite_codes(n), do: Enum.map(0..n, fn _ -> create_invite_code() end)
  def create_invite_code do
    code = Ecto.UUID.generate()

    with :ok <- save_invite_code(code) do
      code
    end
  end

  defp delete_invite_code(code), do: ConCache.delete(:beta_token_store, code)
  defp save_invite_code(code), do: ConCache.put(:beta_token_store, code, true)
  defp use_invite_code(code), do: ConCache.put(:beta_token_store, code, "used")
  defp is_used_code?(code), do: ConCache.get(:beta_token_store, code) === "used"
  defp is_unused_code?(code), do: ConCache.get(:beta_token_store, code) === true
  defp is_invite_code?(code), do: ConCache.get(:beta_token_store, code) || false

  defp create_authorization_header(token, exp) do
    "ow-auth-token=" <> "#{token}; Expires=#{format_expiry(exp)}; Secure"
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
