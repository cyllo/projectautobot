defmodule HeroesScraper.HtmlHelpers do
  def find_text(src, query_selector) do
    res = Floki.find(src, query_selector)

    unless res === nil, do: Floki.text(res)
  end

  def find_attribute(src, query_selector, attribute) do
    res = Floki.find(src, query_selector)

    unless res === nil, do: Floki.attribute(res, attribute) |> List.first
  end
end
