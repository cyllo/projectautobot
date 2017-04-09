defmodule Scraper.DataProcessor.Helpers do
  require IEx
  @js_stats_boxes "body.career-detail #competitive .js-stats"
  @overwatch_player_platforms "#profile-platforms a"
  @plural_possibilities_blacklist ["kill streak", "multikill best"]
  @plural_possibilities ["elimination", "blow", "kill", "shot", "hit", "medal", "card", "death", "assist", "pad"]

  def find_html(src, container_query), do: src |> Floki.find(container_query) |> Floki.raw_html

  def find_text(src, query_selector) do
    src
      |> Floki.find(query_selector)
      |> Floki.text
  end

  def find_first_text(src, query_selector) do
    src
      |> Floki.find(query_selector)
      |> List.first
      |> Floki.text
  end

  def find_img_src(src, query_selector) do
    src
      |> Floki.find(query_selector)
      |> Floki.attribute("src")
      |> List.first
  end

  def find_background_img_url(src, query_selector) do
    src
      |> Floki.find(query_selector)
      |> Floki.attribute("style")
      |> List.first
      |> String.replace(~r/background-image:url\(/, "")
      |> String.replace_trailing(")", "")
  end

  def normalize_and_snake("medal"), do: "total_medals"
  def normalize_and_snake("medals"), do: "total_medals"
  def normalize_and_snake("medal " <> tier), do: "#{tier}_medals"
  def normalize_and_snake("medals " <> tier), do: "#{tier}_medals"
  def normalize_and_snake("shot hit"), do: "shots_hit"
  def normalize_and_snake("shots hit"), do: "shots_hit"
  def normalize_and_snake(str) when is_list(str), do: Enum.map(str, &normalize_and_snake/1)
  def normalize_and_snake(str), do: if should_pluralize?(str), do: pluralize_possibility(str), else: str |> String.split |> Enum.join("_")
  defp string_contains_plurals?(str), do: String.contains?(str, @plural_possibilities)
  defp should_pluralize?(str), do: !String.contains?(str, @plural_possibilities_blacklist) && string_contains_plurals?(str)
  defp pluralize_possibility(str) do
    str
      |> String.split
      |> Enum.map(fn(str_item) ->
        if string_contains_plurals?(str_item) && !String.ends_with?(str_item, "s") do
          str_item <> "s"
        else
          str_item
        end
      end)
      |> Enum.join("_")
  end



  def is_page_loaded?(page_source), do: is_page_not_found?(page_source) || career_page_loaded?(page_source)
  def is_page_not_found?(page_source), do: page_source |> body_classes |> classes_has_not_found_page?

  defp career_page_loaded?(src), do: platforms_loaded?(src) && stats_box_loaded?(src)
  defp platforms_loaded?(src), do: Floki.find(src, @overwatch_player_platforms) |> Enum.any?
  defp stats_box_loaded?(src), do: Floki.find(src, @js_stats_boxes) |> Enum.any?
  defp classes_has_not_found_page?(classes_str) when is_nil(classes_str), do: false
  defp classes_has_not_found_page?(classes_str), do: String.contains?(classes_str, "undefined")
  defp body_classes(page_source), do: Floki.attribute(page_source, "body", "class") |> List.first
end
