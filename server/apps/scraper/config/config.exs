# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

config :floki, :html_parser, Floki.HTMLParser.Html5ever

config :hound,
  driver: "phantomjs",
  http: [recv_timeout: :infinity]

config :quantum, :scraper,
  cron: [
    "@daily": &Scraper.refetch_profiles_in_db/0
  ]
