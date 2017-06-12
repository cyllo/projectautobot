defmodule Api.Web.GamerTagChannel do
  use Api.Web, :channel
  import Logger, only: [debug: 1]

  # Server
  def join("gamer_tag:lobby", payload, socket) do
    {:ok, socket}
  end

  def handle_in("change", payload, socket) do
    broadcast socket, "change", payload

    {:noreply, socket}
  end

  # Api
  def broadcast_change(gamer_tag_id) when is_integer(gamer_tag_id), do: broadcast_change([gamer_tag_id])
  def broadcast_change(gamer_tag) when is_map(gamer_tag), do: broadcast_change([gamer_tag.id])

  def broadcast_change(gamer_tags) when is_list(gamer_tags) do
    if (Enum.all? gamer_tags, &is_map/1) do
      gamer_tags
        |> Enum.map(&Map.get(&1, :id))
        |> broadcast_change
    else
      broadcast_change(gamer_tags)
    end
  end

  def broadcast_change(gamer_tags) do
    import IEx
    IEx.pry
    debug "Gamer tags changed #{inspect Enum.map(gamer_tags, &Map.take(&1, [:id, :tag, :region, :platform]))}"

    Api.Web.Endpoint.broadcast("gamer_tag:lobby", "change", %{gamer_tags: gamer_tags})

    gamer_tags
  end
end
