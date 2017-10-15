defmodule Api.HeroResolver do
  import Api.Helpers, only: [preload_id_map: 2]

  alias Models.Game

  def find(params, _info), do: Game.find_hero(params)
  def all(params, _info) when params == %{}, do: {:ok, Game.get_all_heroes()}
  def all(params, _info), do: {:ok, Game.get_all_heroes(params)}

  def get_hero_roles(_, heroes), do: preload_id_map(heroes, :role)
  def get_hero_skills(_, heroes), do: preload_id_map(heroes, :skills)
end
