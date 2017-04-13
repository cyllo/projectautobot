defmodule Api.GamerTagResolver do
  alias Models.Game

  def all(%{}, _info), do: {:ok, Game.get_all_gamer_tags()}
  def all(params, _info), do: {:ok, Game.get_all_gamer_tags(params)}
  def find(params, _info), do: Game.find_gamer_tag(params)
end
