defmodule BattleNet do
  alias BattleNet.BattleNetApi

  def connect_user_to_battle_net(user, client_token) do
    with {:ok, battle_net_info} <- get_battle_net_info(client_token),
         {:ok, user} <- Models.Accounts.update_user(user, battle_net_info) do
      {:ok, user}
    end
  end

  def get_battle_net_info(client_token) do
    with {:ok, %{access_token: token}} <- BattleNetApi.get_access_token(client_token) do
      BattleNetApi.get_user_account(token)
    end
  end
end
