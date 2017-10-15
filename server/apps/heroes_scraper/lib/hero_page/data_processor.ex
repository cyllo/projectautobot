defmodule HeroesScraper.HeroPage.DataProcessor do
  alias HeroesScraper.HtmlHelpers

  @description_class ".hero-detail-description"
  @skills_class ".hero-ability"
  @ability_icon_class ".hero-ability-icon"
  @skill_name_class ".hero-ability-descriptor h4"
  @skill_description_class".hero-ability-descriptor p"

  def process_hero({hero_props, hero_page_src}) do
    Map.merge(hero_props, %{
      description: get_description(hero_page_src),
      skills: get_skills(hero_page_src) |> Enum.map(&process_skill/1)
    })
  end

  defp get_description(hero_page_src) do
    HtmlHelpers.find_text(hero_page_src, @description_class)
  end

  defp get_skills(hero_page_src) do
    Floki.find(hero_page_src, @skills_class)
  end

  defp process_skill(skill_src) do
    %{
      icon_url: get_skill_icon(skill_src),
      name: get_skill_name(skill_src),
      description: get_skill_description(skill_src)
    }
  end

  defp get_skill_icon(skill_src) do
    Floki.find(skill_src, @ability_icon_class)
      |> Floki.attribute("src")
      |> List.first
  end

  defp get_skill_name(skill_src) do
    HtmlHelpers.find_text(skill_src, @skill_name_class)
  end

  defp get_skill_description(skill_src) do
    HtmlHelpers.find_text(skill_src, @skill_description_class)
  end
end

