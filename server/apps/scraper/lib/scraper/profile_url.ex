defmodule Scraper.ProfileUrl do
  @base_url "https://playoverwatch.com/en-us/career/"
  @normalization_regex ~r/(?<name>.*)#(?<number>\d+)/

  def tag_url(gamer_tag, options \\ %{region: "us", platform: "pc"})
  def tag_url(gamer_tag, options), do: normalize_gamer_tag(gamer_tag) |> generate_profile_url(options)

  def get_info_from_url(<<@base_url, platform::binary-size(3), "/", tag::binary>>), do: %{platform: platform, tag: tag}
  def get_info_from_url(<<@base_url, platform::binary-size(2), "/", region::binary-size(2), "/", tag::binary>>) do
    %{platform: platform, tag: tag, region: region}
  end

  defp normalize_gamer_tag(tag) do
    if Regex.match?(@normalization_regex, tag) do
      %{"name" => name, "number" => number} = Regex.named_captures @normalization_regex, tag

      "#{name}-#{number}"
    else
      tag
    end
  end

  defp generate_profile_url(%{tag: tag, region: region, platform: platform}), do: generate_profile_url(tag, %{region: region, platform: platform})
  defp generate_profile_url(gamer_tag, %{region: region, platform: platform}) do
    @base_url <> "#{String.downcase platform}/#{String.downcase region}/#{gamer_tag}"
  end

  defp generate_profile_url(gamer_tag, %{platform: platform}) do
    url = if (platform === "pc") do
      "#{String.downcase platform}/us/#{gamer_tag}"
    else
      "#{String.downcase platform}/#{gamer_tag}"
    end

    @base_url <> url
  end
end
