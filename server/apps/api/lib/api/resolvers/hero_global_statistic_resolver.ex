defmodule Api.HeroStatisticsResolver do
  alias Models.Game

  def find_hero_and_agregate(%{name: name}, _info) do
    with {:ok, hero} <- Game.find_hero(name: name) do
      {:ok, hero}
    end
  end

  def find_hero_and_agregate(%{hero_id: id}, _info) do
    with {:ok, hero} <- Game.get_hero(id) do
      {:ok, hero}
    end
  end
end
