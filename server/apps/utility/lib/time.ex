defmodule Utility.Time do
  def before_today?(time), do: Timex.before?(time, Timex.beginning_of_day(Timex.now()))
  def hours_till(time), do: Timex.diff(Timex.end_of_day(Timex.now()), time, :hours)
  def min_till(time), do: Timex.diff(Timex.end_of_day(Timex.now()), time, :minutes)
end
