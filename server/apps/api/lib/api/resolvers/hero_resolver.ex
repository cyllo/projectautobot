defmodule Api.HeroResolver do
  alias Models.Game

  def find(params, _info), do: Game.find_hero(params)
  def all(%{}, _info), do: {:ok, Game.get_all_heroes()}
  def all(params, _info), do: {:ok, Game.get_all_heroes(params)}
end
