defmodule Scraper.ProfileScraper do
  alias Scraper.{SessionServer, ProfileUrl}
  require Logger

  def get_profile(tag) do
    Logger.debug "Getting Tag #{tag}"

    with {:ok, {gamer_tag, pid}} <- go_to_tag_page(tag),
         {:ok, page_source} <- SessionServer.page_source(pid) do
      SessionServer.end_session pid

      Logger.debug "Ending Session #{tag}"

      {gamer_tag, page_source}
    end
  end


  defp go_to_tag_page(gamer_tag) do
    with {:ok, pid} <- SessionServer.start_link do
      SessionServer.start_session pid

      Logger.debug "Navigating to #{ProfileUrl.tag_url(gamer_tag)}"

      SessionServer.navigate_to pid, ProfileUrl.tag_url(gamer_tag)

      {:ok, {gamer_tag, pid}}
    end
  end
end
