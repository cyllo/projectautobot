use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :api, Api.Web.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :api, :environment, :test

config :api,
  joken_secret: "LU6G8pi3EwS9vo25JSKMjlOIn6pVjpvu4lhP1olT3v6JTR0XL7S/PY+Hw/hQkDYO"
