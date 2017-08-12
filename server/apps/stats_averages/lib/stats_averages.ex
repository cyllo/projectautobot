defmodule StatsAverages do
  use GenServer
  import Logger, only: [info: 1]

  alias StatsAverages.AveragesCreator
  alias Utility.Time

  # API
  def start_link(_), do: start_link()
  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def snapshot_averages do
    GenServer.call __MODULE__, :snapshot_averages
  end

  # SERVER
  def init(_), do: {:ok, Timex.now() |> Timex.shift(days: -1)}

  def handle_call(:snapshot_averages, _from, last_snapshot_time) do
    with true <- Time.before_today?(last_snapshot_time),
         {:ok, leaderboard_snapshot} <- AveragesCreator.create_snapshot do
      info "Took a StatsAverageSnapshot"

      {:reply, {:ok, leaderboard_snapshot}, Timex.now()}
    else
      false -> {
        :reply,
        {:error, "Must wait #{Time.hours_till(last_snapshot_time)} hours (#{Time.min_till(last_snapshot_time)} min) before taking another snapshot"},
        last_snapshot_time
      }
      e -> {:reply, e, last_snapshot_time}
    end
  end
end
