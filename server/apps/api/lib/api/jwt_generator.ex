defmodule Api.JWTGenerator do
  import Joken

  @day_in_sec 86400
  @secret Application.get_env(:api, :joken_secret)

  def generate_token_for_user(%{id: id}) do
    exp = get_exp()

    jwt_token = %{user_id: id}
      |> token
      |> with_exp(exp)
      |> with_iss("STP")
      |> with_signer(hs512(@secret))
      |> sign
      |> get_compact

    {jwt_token, exp}
  end

  def get_user_from_token(token) do
    with {:ok, %{"user_id" => id}} <- verify_token(token), do: Models.Accounts.get_user(id)
  end

  defp verify_token(jwt_token), do: verify!(token(jwt_token), hs512(@secret))
  defp get_exp, do: NaiveDateTime.utc_now() |> NaiveDateTime.add(@day_in_sec, :second)
end
