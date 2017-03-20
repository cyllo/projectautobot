defmodule Scraper.DataProcessor.Helpers do
  @js_stats_boxes "body.career-detail #competitive .js-stats"

  def find_html(src, container_query), do: src |> Floki.find(container_query) |> Floki.raw_html

  def find_text(src, query_selector) do
    src
      |> Floki.find(query_selector)
      |> Floki.text
  end

  def is_page_found?(page_source), do: page_source |> body_classes |> classes_has_not_found_page?
  def is_page_loaded?(page_source), do: !is_page_found?(page_source) || career_page_loaded?(page_source)
  def career_page_loaded?(page_source), do: Floki.find(page_source, @js_stats_boxes) |> Enum.any?

  defp classes_has_not_found_page?(classes_str) when is_nil(classes_str), do: false
  defp classes_has_not_found_page?(classes_str), do: String.contains?(classes_str, "undefined")
  defp body_classes(page_source), do: Floki.attribute(page_source, "body", "class") |> List.first
end
