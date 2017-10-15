defmodule HeroesScraper.Mixfile do
  use Mix.Project

  def project do
    [
      app: :heroes_scraper,
      version: "0.1.0",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.5",
      start_permanent: Mix.env == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:httpoison, "~> 0.10.0"},
      {:floki, "~> 0.17.0"},
      {:html5ever, "~> 0.5.0"},
      {:models, in_umbrella: true},
      {:utility, in_umbrella: true}
    ]
  end
end
