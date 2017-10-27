defmodule Api.Web.Router do
  use Api.Web, :router

  # @max_complexity 500


  pipeline :graphql do
    plug Api.Context
  end

  scope "/" do
    pipe_through :graphql

    forward "/heartbeat", Api.HeartbeatPlug
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
end
