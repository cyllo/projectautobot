defmodule Api.ProfileSearchResolver do
  def find(%{tag: tag}, _info), do: Scraper.search_tag(tag)
end
