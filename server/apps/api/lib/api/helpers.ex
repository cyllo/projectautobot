defmodule Api.Helpers do
  def preload_id_map(models, preload_prop, default \\ nil) do
   for model <- Models.Repo.preload(models, [preload_prop]), into: %{} do
     {model.id, Map.get(model, preload_prop, default)}
   end
  end

  def convert_to_model_id_map(models, original_models, id_prop) do
    for model <- models, into: %{} do
      {get_models_by_id_prop(original_models, model.id, id_prop) |> Map.get(:id), model}
    end
  end

  def convert_to_id_map(models, ids, id_prop \\ :id)
  def convert_to_id_map([], ids, _), do: Enum.reduce(ids, %{}, fn(id, acc) -> Map.put(acc, id, []) end)
  def convert_to_id_map(models, ids, id_prop) when is_list(models) and is_list(ids) do
    for id <- ids, into: %{} do
      {id, get_models_by_id_prop(models, id, id_prop)}
    end
  end
  def convert_to_id_map(any, _, _), do: any

  defp get_models_by_id_prop(models, id, id_prop) do
    case Enum.filter(models, &(Map.get(&1, id_prop) === id)) do
      [] -> nil
      [model] -> model
      models -> models
     end
  end
end
