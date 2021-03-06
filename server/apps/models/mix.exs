defmodule Models.Mixfile do
  use Mix.Project

  def project do
    [app: :models,
     version: "0.1.0",
     build_path: "../../_build",
     config_path: "../../config/config.exs",
     deps_path: "../../deps",
     lockfile: "../../mix.lock",
     elixir: "~> 1.4",
     elixirc_paths: elixirc_paths(Mix.env),
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: aliases(),
     deps: deps()]
  end

  # Configuration for the OTP application
  #
  # Type "mix help compile.app" for more information
  def application do
    # Specify extra applications you'll use from Erlang/Elixir
    [
      mod: {Models, []},
      extra_applications: [:logger]
    ]
  end

  # Dependencies can be Hex packages:
  #
  #   {:my_dep, "~> 0.3.0"}
  #
  # Or git/path repositories:
  #
  #   {:my_dep, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
  #
  # To depend on another app inside the umbrella:
  #
  #   {:my_app, in_umbrella: true}
  #
  # Type "mix help deps" for more examples and options
  defp deps do
    [
      {:ecto, "~> 2.1.4"},
      {:postgrex, ">= 0.0.0"},
      {:comeonin, "~> 3.0", override: true},
      {:con_cache, "~> 0.12.0"},
      {:ecto_enum, "~> 1.0"},
      {:utility, in_umbrella: true}
    ]
  end

  defp aliases, do: [
    "test": ["ecto.drop --quiet", "ecto.create --quiet", "ecto.migrate", "test"],
    "ecto.reset": ["ecto.drop", "ecto.create", "ecto.migrate"]
  ]
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]
end
