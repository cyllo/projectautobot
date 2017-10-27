defmodule Api.HeartbeatPlug do
  @default_path "/heartbeat"

  @behaviour Plug
  import Plug.Conn

  def init(opts), do: Keyword.merge([path: @default_path, json: false], opts)

  def call(%Plug.Conn{} = conn, opts) do
    if conn.request_path == opts[:path] and conn.method in ~w(GET HEAD) do
      conn |> halt |> send_beat(opts[:json])
    else
      conn
    end
  end

  defp send_beat(conn, false = _json),
    do: send_resp(conn, 200, "OK")
  defp send_beat(conn, true = _json),
    do: conn |> put_resp_content_type("application/json") |> send_resp(200, "{}")
end
