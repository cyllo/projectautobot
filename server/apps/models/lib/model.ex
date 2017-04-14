defmodule Models.Model do
  defmacro __using__(_) do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.{Query, Changeset}

      # import Models.Model, [create_model_methods: 1]
    end
  end

  defmacro create_model_methods(model) do
    quote do
      unquote(create_get_for_model(model))
      unquote(create_find_for_model(model))
      unquote(create_get_by_ids_for_model(model))
    end
  end

  def find_model(model, params) when is_map(params), do: find_model(model, Map.to_list(params))
  def find_model(_, params) when is_list(params) and length(params) <= 0, do: {:error, "no params given for find"}
  def find_model(model, params) when is_list(params) do
    case params && Models.Repo.get_by(model, params) do
      nil -> {:error, "where #{inspect(params)} not found"}
      user -> {:ok, user}
    end
  end

  defp get_model_name(model), do: ~r/[^\.]+$/ |> Regex.run(Macro.to_string(model)) |> List.first |> Macro.underscore

  defp pluralize_model_name("game_history"), do: "game_histories"
  defp pluralize_model_name("hero"), do: "heroes"
  defp pluralize_model_name(model_name), do: model_name <> "s"

  defp get_and_pluralize_model_name(model), do: model |> get_model_name |> pluralize_model_name

  defp create_get_for_model(model) do
    fn_name = :"get_#{get_model_name(model)}"

    quote do
      @spec unquote(fn_name)(id :: String.t) :: unquote(model)
      def unquote(fn_name)(id) do
        case Models.Repo.get(unquote(model), id) do
          nil -> {:error, "#{id} not found"}
          model -> {:ok, model}
        end
      end
    end
  end

  defp create_find_for_model(model) do
    fn_name = :"find_#{get_model_name(model)}"

    quote do
      # @spec unquote(fn_name)(params) :: unquote(model)
      def unquote(fn_name)(params), do: Models.Model.find_model(unquote(model), params)
    end
  end

  defp create_get_by_ids_for_model(model) do
    fn_name = :"get_#{get_and_pluralize_model_name(model)}_by_ids"

    quote do
      @spec unquote(fn_name)(ids :: [String.t]) :: [unquote(model)]
      def unquote(fn_name)(ids) do
        import Ecto.Query, only: [from: 2]

        from(m in unquote(model), where: m.id in ^ids)
          |> Models.Repo.all
      end
    end
  end
end
