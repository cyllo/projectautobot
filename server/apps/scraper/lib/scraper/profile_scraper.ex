defmodule Scraper.ProfileScraper do
  alias Scraper.{SessionServer, ProfileUrl}
  require Logger

  def get_profile(%{tag: tag, platform: platform, region: region}), do: get_profile(tag, platform, region)
  def get_profile(%{tag: tag, platform: platform}), do: get_profile(tag, platform)
  def get_profile(tag, platform \\ nil, region \\ nil) do
    Logger.info "Getting Tag #{tag} #{platform} #{region}"

    with {:ok, {gamer_tag, pid}} <- go_to_tag_page(tag, platform, region),
         {:ok, page_source} <- SessionServer.page_source(pid) do
      SessionServer.end_session pid

      Logger.info "Ending Session #{tag} #{platform} #{region}"

      {gamer_tag, page_source}
    end
  end

  defp go_to_tag_page(tag, platform, region) do
    with {:ok, pid} <- SessionServer.start_link do
      SessionServer.start_session pid
      params = %{platform: platform, region: region}

      Logger.info "Navigating to #{ProfileUrl.tag_url(tag, params)}"

      SessionServer.navigate_to pid, ProfileUrl.tag_url(URI.encode(tag), params)

      {:ok, {tag, pid}}
    end
  end
end
