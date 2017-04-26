defmodule Api.Middleware.ChangesetErrorFormatter do
  import IEx

  def call(%{errors: []} = res, _), do: res
  def call(%{errors: errors} = res, _), do: %{res | errors: format_changeset_error(errors)}

  defp format_changeset_error(error) do
    Enum.flat_map(error, fn
      %Ecto.Changeset{} = changeset -> format_changeset(changeset)
      error -> error
    end)
  end

  defp format_changeset(changeset) do
    changeset
      |> interpolate_errors
      |> Map.to_list
      |> Enum.flat_map(fn {field, errors} -> field_errors_to_error(changeset, field, errors) end)
  end

  def field_errors_to_error(changeset, field, errors) do
    field_name = Atom.to_string(field)

    Enum.map(errors, fn error ->
      %{
        message: field_name <> " " <> error,
        value: error_field_value(changeset, field)
      }
    end)
  end

  defp interpolate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end

  @spec error_field_value(changeset :: Ecto.Changeset.t, field :: atom) :: any
  defp error_field_value(changeset, field) do
    case Ecto.Changeset.fetch_field(changeset, field) do
      {_, value} -> value
      :error -> nil
    end
  end
end
