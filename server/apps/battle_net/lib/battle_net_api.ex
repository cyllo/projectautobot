defmodule BattleNet.Api do
  import Logger, only: [info: 1, metadata: 1]

  @client_id Application.get_env(:battle_net, :client_id)
  @client_secret Application.get_env(:battle_net, :client_secret)
  @redirect_uri Application.get_env(:battle_net, :callback_uri)
  @token_url "https://us.battle.net/oauth/token"
  @account_url "https://us.api.battle.net/account/user"

  # you can pass options to the underlying http library via `opts` parameter
  def get_access_token(code) do
    metadata([
      client_secret: @client_secret,
      client_id: @client_id,
      callback_uri: @redirect_uri,
      client_auth_token: code
    ])

    Logger.info("Getting blizzard account access token")

    with {:ok, %{body: body}} <- HTTPoison.post(@token_url, [], [], params: token_params(code)),
         {:ok, %{"access_token" => access_token, "expires_in" => expires_in}} <- Poison.decode(body) do
      {:ok, %{access_token: access_token, expires_in: expires_in}}
    else
      {:ok, %{"error" => "invalid_request", "error_description" => e}} -> {:error, "Battle.Net Error: #{inspect e}"}
      {:ok, %{"error" => "invalid_request"}} -> {:error, "Battle.Net Auth token is invalid"}
      {:ok, e} -> {:error, e}
      e -> e
    end
  end

  def get_user_account(%{access_token: token}), do: get_user_account(token)
  def get_user_account(token) do
    metadata(client_access_token: token)
    info("Getting blizzard account with access token")

    with {:ok, %{body: body}} <- HTTPoison.get(@account_url, [], params: [access_token: token]),
         {:ok, %{"id" => battle_net_id, "battletag" => battle_net_tag}} <- Poison.decode(body) do
      {:ok, %{battle_net_id: battle_net_id, battle_net_tag: battle_net_tag}}
    else
      {:ok, e} -> {:error, e}
      e -> e
    end
  end

  defp token_params(code) do
    [
      code: code,
      grant_type: "authorization_code",
      redirect_uri: @redirect_uri,
      client_id: @client_id,
      client_secret: @client_secret
    ]
  end
end
