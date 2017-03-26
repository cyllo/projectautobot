defmodule Models.Model do
  defmacro __using__(_) do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.{Query, Changeset}
    end
  end
end
