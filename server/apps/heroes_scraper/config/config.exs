# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

config :heroes_scraper, ecto_repos: []

config :floki, :html_parser, Floki.HTMLParser.Html5ever
