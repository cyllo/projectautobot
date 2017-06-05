defmodule Api.Middleware.Auth do
  def call(%{context: %{current_user: user}} = res, [admin_only: true]) do
    if (is_dev?() and user.is_admin), do: res, else: put_error(res, "unauthorized (Admin Only)")
  end

  def call(%{context: %{current_user: user}} = res, _), do: res
  def call(res, _), do: put_error(res, "unauthenticated")

  defp put_error(res, error_message), do: Absinthe.Resolution.put_result(res, {:error, error_message})
  defp is_dev?, do: Mix.env === "dev"
end
