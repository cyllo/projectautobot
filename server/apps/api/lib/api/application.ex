defmodule Api.Application do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Start the endpoint when the application starts
      supervisor(Api.Web.Endpoint, []),
      # Start your own worker by calling: Api.Worker.start_link(arg1, arg2, arg3)
      # worker(Api.Worker, [arg1, arg2, arg3]),
      supervisor(ConCache, [
        [ttl_check: :timer.seconds(5), ttl: Api.JWTGenerator.token_ttl() - 200], #TTL - 200 for time to process
        [name: :session_token_store]
      ], id: :session_token_store)
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Api.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
