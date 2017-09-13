use Mix.Config

config :models, Models.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: "${DB_URL}",
  pool_size: 20
