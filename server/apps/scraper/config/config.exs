# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

config :floki, :html_parser, Floki.HTMLParser.Html5ever

config :hound,
  driver: "phantomjs",
  http: [recv_timeout: :infinity]

config :quantum, global?: true
config :quantum, :scraper,
  cron: [
    "@daily": {Scraper, :refetch_profiles_in_db, []}
  ]

config :scraper,
  ecto_repos: [],
  rank_map: [
    bronze: 1499,
    silver: 1999,
    gold: 2499,
    platinum: 2999,
    diamond: 3499,
    master: 3999,
    grandmaster: 5000
  ]

if Mix.env() === :prod do
  import_config "prod.exs"
end
