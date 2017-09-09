defmodule Scraper.HtmlHelpers do
  @stat_regex ~r/{count, plural.+}/
  @page_url "link[rel=canonical]"
  @overwatch_player_platforms "#profile-platforms a"
  @page_not_found "h1.u-align-center"
  @platform_active ".is-active"
  @per10_regex ~r/per 10/
  @plural_possibilities_blacklist ["kill streak", "multikill best"]
  @plural_possibilities [
    "elimination", "blow", "kill",
    "shot", "hit", "medal",
    "card", "death", "assist",
    "pad", "generator", "turret"
  ]

  def find_html(src, container_query), do: src |> Floki.find(container_query) |> Floki.raw_html

  def find_href(src), do: src |> Floki.attribute("href") |> List.first

  def find_text(src, query_selector) do
    res = Floki.find(src, query_selector)

    unless res === nil, do: Floki.text(res), else: nil
  end

  def find_first_text(src, query_selector) do
    res = src |> Floki.find(query_selector) |> List.first

    unless res === nil, do: Floki.text(res), else: nil
  end

  def find_page_url(src) do
    url_link = Floki.find(src, @page_url)

    unless url_link === nil, do: Floki.attribute(url_link, "href") |> List.first, else: nil
  end

  def find_img_src(src, query_selector) do
    res = Floki.find(src, query_selector)

    unless res === nil, do: res |> Floki.attribute("src") |> List.first, else: nil
  end

  def find_background_img_url(src, query_selector) do
    case Floki.find(src, query_selector) do
      [] -> nil
      res -> background_img_url(res)
    end
  end

  def background_img_url(src) do
    src
      |> Floki.attribute("style")
      |> List.first
      |> String.replace(~r/background-image:url\(/, "")
      |> String.replace_trailing(")", "")
  end

  def find_player_platforms(src), do: Floki.find(src, @overwatch_player_platforms)
  def find_inactive_player_platforms(src), do: Floki.find(src, @overwatch_player_platforms <> ":not(#{@platform_active})")
  def find_active_player_platform(src), do: find_text(src, @overwatch_player_platforms <> @platform_active)

  def normalize_and_snake("medal"), do: "total_medals"
  def normalize_and_snake("medals"), do: "total_medals"
  def normalize_and_snake("medal " <> tier), do: "#{tier}_medals"
  def normalize_and_snake("medals " <> tier), do: "#{tier}_medals"
  def normalize_and_snake("shot hit"), do: "shots_hit"
  def normalize_and_snake("shots hit"), do: "shots_hit"
  def normalize_and_snake(str) when is_list(str), do: Enum.map(str, &normalize_and_snake/1)
  def normalize_and_snake(str) do
    str = if Regex.match?(@per10_regex, str), do: Regex.replace(@per10_regex, str, "per10"), else: str

    if should_pluralize?(str), do: pluralize_possibility(str), else: str |> String.split |> Enum.join("_")
  end

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

  def is_page_loaded?(page_source), do: is_page_not_found?(page_source) or career_page_loaded?(page_source)
  def is_page_not_found?(page_source), do: page_source |> find_text(@page_not_found) |> classes_has_not_found_page?

  defp career_page_loaded?(src), do: platforms_loaded?(src) and stats_loaded?(src)
  defp stats_loaded?(src), do: !Regex.match?(@stat_regex, src)
  defp platforms_loaded?(src), do: find_player_platforms(src) |> Enum.any?
  defp classes_has_not_found_page?(text) when is_nil(text), do: false
  defp classes_has_not_found_page?(text), do: text |> String.upcase |> String.contains?("PAGE NOT FOUND")
end
