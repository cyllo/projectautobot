defmodule StatsLeaderboard do
  use GenServer
  import Logger, only: [info: 1]

  alias StatsLeaderboard.LeaderboardCalculator

  # API
  def start_link(_), do: start_link()
  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def snapshot_leaderboard_rankings do

    GenServer.call __MODULE__, :snapshot_leaderboard_rankings
  end

  # SERVER
  def init(_), do: {:ok, Timex.now() |> Timex.shift(days: -1)}

  def handle_call(:snapshot_leaderboard_rankings, _from, last_snapshot_time) do
    with true <- before_today?(last_snapshot_time),
         {:ok, leaderboard_snapshot} <- LeaderboardCalculator.create_leaderboard_snapshot() do
      info "Took a LeaderboardSnapshot"

      {:reply, {:ok, leaderboard_snapshot}, Timex.now()}
    else
      false -> {
        :reply,
        {:error, "Must wait #{hours_till_can_snapshot(last_snapshot_time)} hours (#{min_till_can_snapshot(last_snapshot_time)} min) before taking another snapshot"},
        last_snapshot_time
      }
      e -> {:reply, e, last_snapshot_time}
    end
  end

  defp before_today?(time), do: Timex.before?(time, Timex.beginning_of_day(Timex.now()))
  defp hours_till_can_snapshot(time), do: Timex.diff(Timex.end_of_day(Timex.now()), time, :hours)
  defp min_till_can_snapshot(time), do: Timex.diff(Timex.end_of_day(Timex.now()), time, :minutes)
end
