# Import all plugins from `rel/plugins`
# They can then be used by adding `plugin MyPlugin` to
# either an environment, or release definition, where
# `MyPlugin` is the name of the plugin module.
Path.join(["rel", "plugins", "*.exs"])
|> Path.wildcard()
|> Enum.map(&Code.eval_file(&1))

use Mix.Releases.Config,
    # This sets the default release built by `mix release`
    default_release: :default,
    # This sets the default environment used by `mix release`
    default_environment: Mix.env()

# For a full list of config options for both releases
# and environments, visit https://hexdocs.pm/distillery/configuration.html


# You may define one or more environments in this file,
# an environment's settings will override those of a release
# when building in that environment, this combination of release
# and environment configuration is called a profile

environment :dev do
  set dev_mode: true
  set include_erts: false
  set cookie: :"fTIfgaj@{`BgspE~Kt*j[[WIc7!,V$AjZKdfi9|u_}tFP?)Q44>jx`HoxxZoXNf("
end

environment :prod do
  set include_erts: true
  set include_src: false
  set cookie: :"}{w4f.;FUYS<whroiO&TUN*(,..m]TEM[}ZeP@w2<`fdaIl;VJGGa*LGxkhUE=xm"
end

# You may define one or more releases in this file.
# If you have not set a default release, or selected one
# when running `mix release`, the first release in the file
# will be used by default

release :server do
  set version: "0.1.0"
  set commands: [
    "migrate": "rel/commands/migrate.sh",
    "generate_beta_code": "rel/commands/generate_beta_code.sh"
  ]
  set applications: [
    :runtime_tools,
    :exactor,
    :gen_stage,
    api: :permanent,
    models: :permanent,
    scraper: :permanent,
    stats_leaderboard: :permanent,
    stats_averages: :permanent,
    heroes_scraper: :permanent
  ]
end

