defmodule StopThePayload.Mixfile do
  use Mix.Project

  def project do
    [apps_path: "apps",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: aliases(),
     deps: deps()]
  end

  # Dependencies can be Hex packages:
  #
  #   {:my_dep, "~> 0.3.0"}
  #
  # Or git/path repositories:
  #
  #   {:my_dep, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
  #
  # Type "mix help deps" for more examples and options.
  #
  # Dependencies listed here are available only for this project
  # and cannot be accessed from applications inside the apps folder

  defp deps do
    [
      {:dialyxir, "~> 0.5", only: [:dev], runtime: false},
      {:distillery, "~> 1.0", runtime: false}
    ]
  end

  defp aliases, do: [
    "test": ["ecto.drop --quiet", "ecto.create --quiet", "ecto.migrate", "test"],
    "ecto.reset": ["ecto.drop", "ecto.create", "ecto.migrate"],
    "ecto.seed": "run apps/models/priv/repo/seeds.exs"
  ]
end
