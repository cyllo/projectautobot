use Mix.Config

config :logger, level: :warn

config :models, Models.Repo,
  adapter: Ecto.Adapters.Postgres,
  pool: Ecto.Adapters.SQL.Sandbox,
  database: "stop_the_payload_test",
  username: "postgres",
  hostname: "localhost"
