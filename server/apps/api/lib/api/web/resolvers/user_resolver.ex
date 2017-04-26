defmodule Api.UserResolver do
  alias Models.Accounts

  def create(params, _info), do: Accounts.create_user(params)
end
