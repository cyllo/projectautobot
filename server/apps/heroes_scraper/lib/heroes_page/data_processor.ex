defmodule HeroesScraper.HeroesPage.DataProcessor do
  alias HeroesScraper.HtmlHelpers

  @hero_box_class ".hero-portrait-detailed"
  @hero_name_class ".portrait-title"
  @hero_role_class "svg use"
  @hero_portrait_class "img"
  @hero_link_prefix "https://playoverwatch.com"

  def process_heroes(heroes_page_results) do
    heroes_page_results
      |> get_hero_containers
      |> Enum.map(&get_hero_props/1)
  end

  defp get_hero_containers(page_results) do
    Floki.find(page_results, @hero_box_class)
  end

  defp get_hero_props(hero_box) do
    role_url = get_role_url(hero_box)

    %{
      name: get_hero_name(hero_box),
      role: get_role_name(role_url),
      role_svg_url: role_url,
      select_portrait_url: get_select_portrait_url(hero_box),
      hero_page_link: get_page_link(hero_box)
    }
  end

  defp get_hero_name(hero_box) do
    HtmlHelpers.find_text(hero_box, @hero_name_class)
  end

  defp get_role_name(role) do
    Regex.run(~r/#(.*)$/, role)
      |> List.last
  end

  defp get_role_url(hero_box) do
    HtmlHelpers.find_attribute(hero_box, @hero_role_class, "href")
  end

  defp get_select_portrait_url(hero_box) do
    HtmlHelpers.find_attribute(hero_box, @hero_portrait_class, "src")
  end

  defp get_page_link(hero_box) do
    link = Floki.attribute(hero_box, "href")
      |> List.first

    @hero_link_prefix <> link
  end
end
