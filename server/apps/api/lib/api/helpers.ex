defmodule Api.Helpers do
  def ms_to_sec(ms), do: ms / 1000
  def ms_to_min(ms), do: Float.round(ms_to_sec(ms) / 60, 2)
end
