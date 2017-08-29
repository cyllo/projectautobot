defmodule Models.Model do
  import Ecto.Query, only: [limit: 2, order_by: 2, where: 3, from: 2, subquery: 1, exclude: 2]
  import Logger, only: [debug: 1]

  defmacro __using__(_) do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.{Query, Changeset}
    end
  end

  @doc """
    Creates model methods for a ecto Schema

    alias Models.{Model, Game.GamerTag, Game.Hero}
    Model.create_model_methods(Hero)
    Model.create_model_methods(GamerTag, only: [:find, :get, :get_by_ids, :get_all, :update, :insert_or_update])
  """
  defmacro create_model_methods(model, opts \\ []) do
    quote do
      # has_only? = Keyword.has_key?(unquote(opts), :only)
      # only = Keyword.get(unquote(opts), :only)

      # if has_only? && :get in only do
        unquote(create_get_for_model(model))
      # end

      # if has_only? && :find in only do
        unquote(create_find_for_model(model))
      # end

      # if has_only? && :get_by_ids in only do
        unquote(create_get_by_ids_for_model(model))
      # end

      # if has_only? && :get_all in only do
        unquote(create_get_all_for_model(model))
      # end

      # if has_only? && :update in only do
        unquote(create_update_for_model(model))
      # end

      # if has_only? && :insert_or_update in only do
        unquote(create_update_or_create(model))
      # end
    end
  end

  def create_model_filters(query, params) when is_map(params), do: create_model_filters(query, Map.to_list(params))
  def create_model_filters(query, params), do: Enum.reduce(params, order_by(query, :id), &create_model_filter/2)
  def create_model_filter({:start_date, val}, query), do: where(query, [m], m.inserted_at >= ^(val))
  def create_model_filter({:end_date, val}, query), do: where(query, [m], m.inserted_at <= ^val)
  def create_model_filter({:before, id}, query), do: where(query, [m], m.id < ^id)
  def create_model_filter({:after, id}, query), do: where(query, [m], m.id > ^id)
  def create_model_filter({:ids, ids}, query), do: where(query, [m], m.id in ^ids)

  def create_model_filter({:first, val}, query), do: limit(query, ^val)
  def create_model_filter({:last, val}, query) do
    query
      |> exclude(:order_by)
      |> from(order_by: [desc: :inserted_at], limit: ^val)
      |> subquery
      |> order_by(:id)
  end

  def create_model_filter({filter_field, val}, %{from: {_, model}} = query), do: create_model_filter({filter_field, val}, model, query)
  def create_model_filter({filter_field, val}, model), do: create_model_filter({filter_field, val}, model, model)

  def create_model_filter({filter_field, val}, %{from: %{query: %{from: {_, model}}}}, query) do
    import IEx
    IEx.pry
    create_model_filter({filter_field, val}, model, query)
  end

  def create_model_filter({filter_field, val}, model, query) do
    if filter_field in model.__schema__(:fields) do
      where(query, [m], field(m, ^filter_field) == ^val)
    else
      debug "create_model_filter: #{Atom.to_string(filter_field)} is not a field for #{model.__schema__(:source)} where filter"

      query
    end
  end

  # @spec create_field_averages(Ecto.Schema.t) :: Ecto.Queryable.t
  # def create_field_averages(model) do
  #   import Ecto.Query

  #   fields = model.__struct__(:field) -- [:id]

  #   Enum.reduce(fields, from(model), fn field ->

  #   end)
  # end

  def find_model(model, params) when is_map(params), do: find_model(model, Map.to_list(params))
  def find_model(_, params) when is_list(params) and length(params) <= 0, do: {:error, "no params given for find"}
  def find_model(model, params) when is_list(params) do
    case params && Models.Repo.get_by(model, Enum.filter(params, fn {_, v} -> not is_nil(v) end) |> Keyword.take(model.__schema__(:fields))) do
      nil -> {:error, "where #{inspect(params)} not found"}
      user -> {:ok, user}
    end
  end

  defp get_model_name(model), do: ~r/[^\.]+$/ |> Regex.run(Macro.to_string(model)) |> List.first |> Macro.underscore

  defp pluralize_model_name("game_history"), do: "game_histories"
  defp pluralize_model_name("hero"), do: "heroes"
  defp pluralize_model_name(model_name), do: model_name <> "s"

  defp get_and_pluralize_model_name(model), do: model |> get_model_name |> pluralize_model_name

  defp create_update_or_create(model) do
    model_name = get_model_name(model)
    fn_name = :"update_or_create_#{model_name}"
    find_name = :"find_#{model_name}"

    quote do
      import Ecto.Query, only: [from: 2]

      @spec unquote(fn_name)(params :: map) :: unquote(model)
      def unquote(fn_name)(params) when is_map(params), do: unquote(fn_name)(Map.to_list(params))

      @spec unquote(fn_name)(params :: map, find_param_list :: list) :: unquote(model)
      def unquote(fn_name)(params, find_param_list) when is_map(params), do: unquote(fn_name)(Map.to_list(params), find_param_list)

      @spec unquote(fn_name)(params :: list, find_param_list :: list) :: unquote(model)
      def unquote(fn_name)(params, find_param_list) when is_list(params) do
        with {:ok, model_data} <- apply(__MODULE__, unquote(find_name), [Keyword.take(params, find_param_list)]) do
          unquote(model).changeset(model_data, Map.new(params))
        else
          {:error, _} ->
            params |> Map.new |> unquote(model).create_changeset
        end |> Models.Repo.insert_or_update
      end

      @spec unquote(fn_name)(params :: list) :: unquote(model)
      def unquote(fn_name)(params) when is_list(params) do
        with {:ok, model_data} <- apply(__MODULE__, unquote(find_name), [params]) do
          unquote(model).changeset(model_data, Map.new(params))
        else
          {:error, _} ->
            params |> Map.new |> unquote(model).create_changeset
        end |> Models.Repo.insert_or_update
      end
    end
  end

  defp create_get_all_for_model(model) do
    fn_name = :"get_all_#{get_and_pluralize_model_name(model)}"

    quote do
      import Ecto.Query, only: [from: 2]

      @spec unquote(fn_name)() :: [unquote(model)]
      def unquote(fn_name)(), do: Models.Repo.all(unquote(model), order_by: :id)

      @spec unquote(fn_name)(params :: map | list) :: [unquote(model)]
      def unquote(fn_name)(params), do: unquote(model) |> Models.Model.create_model_filters(params) |> Models.Repo.all

      @spec unquote(fn_name)(where :: Keyword.t, preload :: Keyword.t) :: [unquote(model)]
      def unquote(fn_name)(where, preload \\ []) do
        from(unquote(model), where: ^where, preload: ^preload) |> Models.Repo.all(order_by: :id)
      end
    end
  end

  defp create_get_for_model(model) do
    fn_name = :"get_#{get_model_name(model)}"

    quote do
      import Ecto.Query, only: [from: 2]

      @spec unquote(fn_name)(id :: String.t, preloads :: Keyword.t) :: unquote(model)
      def unquote(fn_name)(id, preloads \\ []) do
        case from(unquote(model), preload: ^preloads) |> Models.Repo.get(id) do
          nil -> {:error, "#{unquote(get_display_model_name(model))} #{id} not found"}
          model -> {:ok, model}
        end
      end
    end
  end

  defp create_update_for_model(model) do
    fn_name = :"update_#{get_model_name(model)}"

    quote do
      @spec unquote(fn_name)(id :: integer, params :: map) :: unquote(model)
      def unquote(fn_name)(id, params) when is_integer(id) do
        case Models.Repo.get(unquote(model), id) do
          nil -> {:error, "No post found with id - #{id}"}
          model ->
            unquote(model).changeset(model, params)
              |> Models.Repo.update
        end
      end

      @spec unquote(fn_name)(model :: unquote(model), params :: map) :: unquote(model)
      def unquote(fn_name)(model_data, params), do: unquote(model).changeset(model_data, params) |> Models.Repo.update
    end
  end

  defp create_find_for_model(model) do
    fn_name = :"find_#{get_model_name(model)}"

    quote do
      @spec unquote(fn_name)(params :: map) :: unquote(model)
      def unquote(fn_name)(params), do: unquote(model)|> Models.Model.find_model(params)
    end
  end

  defp create_get_by_ids_for_model(model) do
    fn_name = :"get_#{get_and_pluralize_model_name(model)}_by_ids"

    quote do
      @spec unquote(fn_name)(ids :: [String.t]) :: [unquote(model)]
      def unquote(fn_name)(ids, params \\ []) do
        import Ecto.Query, only: [from: 2]

        from(m in unquote(model), where: m.id in ^ids)
          |> Models.Repo.all
      end
    end
  end

  defp get_display_model_name(model) do
    model
      |> get_model_name
      |> String.split("_")
      |> Enum.map(&String.capitalize/1)
      |> Enum.join(" ")
  end
end
