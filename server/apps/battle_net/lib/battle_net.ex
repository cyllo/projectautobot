defmodule BattleNet do
  import Logger, only: [warn: 1]

  alias BattleNet.Api, as: BattleNetApi
  alias BattleNet.UserConnector, as: BattleNetUserConnector

  def link_gamer_tags_to_user(user) do
    with {:ok, gamer_tags} <- BattleNetUserConnector.find_owned_gamer_tags(user.battle_net_id),
         {:ok, gamer_tags} <- BattleNetUserConnector.connect_gamer_tags_to_user(user, gamer_tags) do
      Task.start(fn -> Scraper.scrape_gamer_tags(gamer_tags) end)

      {:ok, gamer_tags}
    else
      e -> warn e
    end
  end

  def connect_user_to_battle_net(user, client_token) do
    with {:ok, battle_net_info} <- get_battle_net_info(client_token),
         {:ok, user} <- Models.Accounts.update_user(user, battle_net_info),
         {:ok, gamer_tags} <- link_gamer_tags_to_user(user) do
      {:ok, Map.put(user, :gamer_tags, gamer_tags)}
    end
  end

  def get_battle_net_info(client_token) do
    with {:ok, %{access_token: token}} <- BattleNetApi.get_access_token(client_token) do
      BattleNetApi.get_user_account(token)
    end
  end
end
