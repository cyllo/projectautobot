# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

# This configuration is loaded before any dependency and is restricted
# to this project. If another project depends on this project, this
# file won't be loaded nor affect the parent project. For this reason,
# if you want to provide default values for your application for
# 3rd-party users, it should be done in your "mix.exs" file.

# You can configure for your application as:
#
#     config :battle_net, key: :value
#
# And access this configuration in your application as:
#
#     Application.get_env(:battle_net, :key)
#
# Or configure a 3rd-party app:
#
# config :logger, level: :info,
#

config :logger, :console,
  level: :info,
  compile_time_purge_level: :info,
  metadata: [
    :callback_uri,
    :client_id,
    :client_auth_token,
    :client_access_token
  ]
# It is also possible to import configuration files, relative to this
# directory. For example, you can emulate configuration per environment
# by uncommenting the line below and defining dev.exs, test.exs and such.
# Configuration from the imported file will override the ones defined
# here (which is why it is important to import them last).
#
config :battle_net, ecto_repos: []

cond do
  Mix.env === :dev -> import_config("dev.secret.exs")
  Mix.env === :prod -> import_config("prod.exs")
end

