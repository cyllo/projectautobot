defmodule Api.BasicAuth do
  import Plug.Conn

  @realm "Basic realm=\"STP Beta\""

  def init(opts), do: opts

  def call(conn, _opts) do
    case auth_token_cookie(conn) || get_req_header(conn, "authorization") do
      ["Bearer " <> token] -> login_user_with_token(conn, token)

      ["Basic " <> attempted_auth] ->
        with {:ok, [username, password]} <- decode_auth_credentials(attempted_auth) do
          Api.BetaToken.basic_auth_login(conn, username, password)
        else
          _ -> unauthorized(conn)
        end

      _ -> unauthorized(conn)
    end
  end

  defp auth_token_cookie(conn) do
    token = conn
      |> fetch_cookies
      |> Map.get(:cookies, %{})
      |> Map.get("ow-auth-token")

    if token, do: ["Bearer #{token}"], else: false
  end

  defp unauthorized(conn) do
    conn
    |> put_resp_header("www-authenticate", @realm)
    |> Api.BetaToken.basic_auth_error
  end

  defp login_user_with_token(conn, token) do
    with {:ok, user} <- Api.JWTGenerator.get_user_from_token(token),
         true <- Api.UserSessionTracker.session_active?(user.id, token) do
      conn
    else
      _ -> unauthorized(conn)
    end
  end

  defp decode_auth_credentials(attempted_auth) do
    credentials = Base.decode64!(attempted_auth)

    if credentials !== ":" do
      {:ok, String.split(credentials, ":")}
    else
      :error
    end
  end
end
