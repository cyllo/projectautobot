defmodule StatsLeaderboard.PlatformRankingCalculatorServer do
  use GenServer

  def start_link(_), do: start_link()
  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def calculate_ranks(leaderboard_snapshot, platform, region) do
    GenServer.call(__MODULE__, {:calculate_ranks, leaderboard_snapshot, platform, region}, 10_000)
  end

  def handle_call({:calculate_ranks, leaderboard_snapshot, platform, region}, _from, state) do
    task = Task.async(fn ->
      StatsLeaderboard.PlatformRankingCalculator.calculate_leaderboard_rankings(leaderboard_snapshot, platform, region)
    end)

    {:reply, Task.await(task, 10_000), state}
  end
end
