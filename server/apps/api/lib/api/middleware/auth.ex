defmodule Api.Middleware.Auth do
  def call(res, _) do
    if Map.get(res.context, :current_user) do
      res
    else
      Absinthe.Resolution.put_result(res, {:error, "unauthenticated"})
    end
  end
end
