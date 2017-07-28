# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

config :scraper, ecto_repos: []

config :floki, :html_parser, Floki.HTMLParser.Html5ever

config :hound,
  driver: "phantomjs", #chrome_driver",
  http: [recv_timeout: :infinity]

config :quantum, :scraper,
  cron: [
    "@daily": {Scraper, :refetch_profiles_in_db, []}
  ]
