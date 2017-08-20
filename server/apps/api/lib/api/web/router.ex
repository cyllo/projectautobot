defmodule Api.Web.Router do
  use Api.Web, :router

  # @max_complexity 500

  pipeline :browser do
    plug :accepts, ["html"]

    if Mix.env() === :prod do
      plug Api.BasicAuth
    end
    # plug :protect_from_forgery
    # plug :put_secure_browser_headers
  end

  pipeline :graphql do
    plug Api.Context
  end

  scope "/" do
    pipe_through :graphql

    forward "/graphql", Absinthe.Plug,
      schema: Api.Schema
      # max_complexity: @max_complexity,
      # analyze_complexity: true

    if Mix.env() === :dev do
      forward "/graphiql", Absinthe.Plug.GraphiQL,
        schema: Api.Schema
        # max_complexity: @max_complexity,
        # analyze_complexity: true
    end
  end

  # if Mix.env() === :prod do
    scope "/" do
      pipe_through :browser

      get "/*path", StaticPageController, :index
    end
  # end
end
