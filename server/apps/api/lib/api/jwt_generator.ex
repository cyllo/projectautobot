defmodule Api.JWTGenerator do
  import Joken

  def generate_token_for_user(user) do
    exp = get_exp()

    token = Map.merge(user, create_claims(exp))
      |> token
      |> with_signer(ed25519ph("MyToken"))
      |> sign
      |> get_compact

    %{token: token, exp: exp}
  end

  defp create_claims(exp) do
    %{
      exp: exp,
      iss: "STP"
    }
  end

  defp get_exp, do: NaiveDateTime.utc_now() |> NaiveDateTime.add(1, :day)
end
