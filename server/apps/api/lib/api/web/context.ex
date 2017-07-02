defmodule Api.Context do
  @behaviour Plug

  import Plug.Conn

  def init(opts), do: opts
  def call(conn, _) do
    with {:ok, user, token} <- get_authorization(conn) do
      put_private(conn, :absinthe, %{context: %{current_user: user, token: token}})
    else
      _ -> conn
    end
  end

  defp get_authorization(conn) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
         {:ok, user} <- Api.JWTGenerator.get_user_from_token(token) do
      {:ok, user, token}
    else
      _ -> {:error, "no token"}
    end
  end
end
