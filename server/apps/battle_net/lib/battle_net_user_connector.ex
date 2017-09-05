defmodule BattleNet.UserConnector do
  import Logger, only: [info: 1]

  alias Models.Game

  @battle_net_connected_platforms "https://playoverwatch.com/en-us/career/get-platforms/"

  def connect_gamer_tags_to_user(user, gamer_tags) do
    tags = gamer_tags
      |> Enum.map(&Map.merge(&1, %{user_id: user.id}))
      |> Enum.map(&find_or_create_gamer_tag(&1, user.id))


    info "Connecting tags to #{user.display_name}: #{inspect Enum.map(tags, &(&1.id))}"

    if length(tags) > 0 do
      with {:ok, user} <- Models.Accounts.update_user(user, %{primary_gamer_tag_id: get_first_gamer_tag_id(tags)}) do
        {:ok, tags}
      end
    else
      []
    end
  end

  def find_owned_gamer_tags(battle_net_id) do
    with {:ok, %{body: body}} <- HTTPoison.get(@battle_net_connected_platforms <> Integer.to_string(battle_net_id)),
         {:ok, platforms} <- Poison.decode(body) do
      gamer_tags = platforms
        |> Enum.filter(&(Map.get(&1, "hasAccount")))
        |> Enum.map(&%{
          platform: Map.get(&1, "platform"),
          region: get_region_param(&1),
          tag: get_gamer_tag(&1)
        })

      {:ok, gamer_tags}
    end
  end

  defp find_or_create_gamer_tag(gamer_tag, user_id) do
    with {:ok, gamer_tag} <- Game.find_gamer_tag(gamer_tag) do
      gamer_tag
    else
      _ ->
        with {:ok, gamer_tag} <- gamer_tag |> Map.put(:user_id, user_id) |> Game.create_gamer_tag do
          gamer_tag
        end
    end
  end

  defp get_gamer_tag(%{"careerLink" => link}), do: Regex.run(~r/[^\/]+$/, link) |> List.first
  defp get_region_param(%{"region" => "global"}), do: ""
  defp get_region_param(%{"region" => region}), do: region
  defp get_first_gamer_tag_id(tags), do: tags |> List.first |> Map.get(:id)
end
