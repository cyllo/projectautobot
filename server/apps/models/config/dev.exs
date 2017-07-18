use Mix.Config

config :models, Models.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "stop_the_payload_dev",
  username: "bob",
  password: "password",
  hostname: "localhost",
  pool_size: 10
