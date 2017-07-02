defmodule Api.Helpers do
  def ms_to_sec(ms), do: div(ms, 1000)
  def ms_to_min(ms), do: Float.round(ms_to_sec(ms) / 60, 2)
  def sec_to_ms(sec), do: sec * 1000
end
