defmodule Api.Middleware.Auth do
  alias Api.UserSessionTracker
  @behaviour Absinthe.Middleware
  @env Application.get(:api, :environment)

  def call(%{context: %{current_user: user, token: token}} = res, [admin_only: true]) do
    session_active? = UserSessionTracker.session_active?(user.id, token)

    cond do
      session_active? and (is_dev?() or user.is_admin) -> res
      !session_active? -> put_inactive_token_error(res)
      true -> put_error(res, "unauthorized (Admin Only)")
    end
  end

  def call(%{context: %{current_user: user, token: token}} = res, _) do
    if UserSessionTracker.session_active?(user.id, token) do
      res
    else
      put_inactive_token_error(res)
    end
  end

  def call(res, _), do: put_error(res, "unauthenticated")

  defp put_error(res, error_message), do: Absinthe.Resolution.put_result(res, {:error, error_message})
  defp put_inactive_token_error(res), do: put_error(res, "user token is not active")
  defp is_dev?, do: @env === :dev
end
