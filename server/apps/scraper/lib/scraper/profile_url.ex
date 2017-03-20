defmodule Scraper.ProfileUrl do
  @base_url "https://playoverwatch.com/en-us/career/"

  def tag_url(gamer_tag, options \\ %{region: "us", platform: "pc"})
  def tag_url(gamer_tag, options), do: normalize_gamer_tag(gamer_tag) |> generate_profile_url(options)

  defp normalize_gamer_tag(tag) do
    regex = ~r/(?<name>.*)#(?<number>\d+)/

    if (Regex.match? regex, tag) do
      %{"name" => name, "number" => number} = Regex.named_captures regex, tag

      "#{name}-#{number}"
    else
      tag
    end
  end

  defp generate_profile_url(gamer_tag, %{platform: platform}) do
    url = if (platform === "pc") do
      "#{String.downcase platform}/us/#{gamer_tag}"
    else
      "#{String.downcase platform}/#{gamer_tag}"
    end

    @base_url <> url
  end

  defp generate_profile_url(gamer_tag, %{region: region, platform: platform}) do
    @base_url <> "#{String.downcase platform}/#{String.downcase region}/#{gamer_tag}"
  end
end
