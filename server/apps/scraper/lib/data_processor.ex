defmodule Scraper.DataProcessor do
  alias Scraper.DataProcessor.{Stats, UserInfo}
  require Logger

  def get_profile_info({gamer_tag, src}), do: get_profile_info(gamer_tag, src)
  def get_profile_info(gamer_tag, src) do
    Logger.debug "Processing #{gamer_tag} data"

    src
      |> Stats.get_stats
      |> Map.merge(UserInfo.user_info(src))
      |> Map.put(:gamer_tag, gamer_tag)
  end
end
