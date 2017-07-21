defmodule Api.Web.GamerTagChannel do
  use Api.Web, :channel
  import Logger, only: [info: 1]

  # Server
  def join("gamer_tag:lobby", _payload, socket) do
    {:ok, socket}
  end

  # Api
  def broadcast_change(gamer_tag_id) when is_integer(gamer_tag_id), do: broadcast_change([gamer_tag_id])
  def broadcast_change(gamer_tag) when is_map(gamer_tag), do: broadcast_change([gamer_tag.id])

  def broadcast_change(gamer_tags) when is_list(gamer_tags) do
    if (Enum.all? gamer_tags, &is_map/1) do
      gamer_tags
        |> Enum.map(&Map.get(&1, :id))
        |> Enum.uniq
        |> broadcast_change
    else
      info "Gamer tags changed #{inspect gamer_tags}"

      Api.Web.Endpoint.broadcast("gamer_tag:lobby", "change", %{gamer_tags: gamer_tags})
    end

    gamer_tags
  end
end
