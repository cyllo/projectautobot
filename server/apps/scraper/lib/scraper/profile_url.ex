defmodule Scraper.ProfileUrl do
  @base_url "https://playoverwatch.com/en-us/career/"

  def tag_url(gamer_tag, options \\ %{region: "us", platform: "pc"})
  def tag_url(gamer_tag, options), do: Models.Helpers.dash_gamer_tag(gamer_tag) |> generate_profile_url(options)

  def get_info_from_url(<<@base_url, platform::binary-size(3), "/", tag::binary>>), do: %{platform: platform, tag: tag}
  def get_info_from_url(<<@base_url, platform::binary-size(2), "/", region::binary-size(2), "/", tag::binary>>) do
    %{platform: platform, tag: tag, region: region}
  end


  defp generate_profile_url(gamer_tag, %{region: region, platform: platform}) when bit_size(region) !== 0 do
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
