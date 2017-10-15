defmodule HeroesScraperTest do
  use ExUnit.Case
  doctest HeroesScraper

  test "greets the world" do
    assert HeroesScraper.hello() == :world
  end
end
