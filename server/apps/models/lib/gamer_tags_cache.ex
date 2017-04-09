defmodule Models.GamerTagsCache do
  def get_last_scraped(gamer_tag) do
    gamer_tag.id
      |> get_from_cache_by_id()
      |> Map.get(:last_scraped)
  end

  def mark_last_scraped(gamer_tag) do
    gamer_tag.id
      |> put(%{last_scraped: DateTime.utc_now()})

    gamer_tag
  end

  defp get_from_cache_by_id(id), do: Map.get(cache(), id)
  defp cache, do: ConCache.get(:model_store, :gamer_tags_store)
  defp put(id, params) do
    gamer_tag_cache = get_from_cache_by_id(id)
    gamer_tag_cache = if (gamer_tag_cache), do: Map.merge(gamer_tag_cache, params), else: params
    new_cache = Map.put(cache() || %{}, id, gamer_tag_cache)

    ConCache.put(:models_store, :heroes_store, new_cache)
  end
end
