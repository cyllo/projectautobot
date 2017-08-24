defmodule ProfileWatch do
  use GenServer
  import Logger, only: [error: 1, info: 1]

  alias Models.Game.GamerTag
  alias ProfileWatch.{ProfileWatchList, ProfileWatcherServer}

  # API
  def start_link(_), do: start_link()
  def start_link, do: GenServer.start_link(__MODULE__, [], name: __MODULE__)

  def start_watch(%GamerTag{} = gamer_tag) do
    GenServer.call(__MODULE__, {:start_watch, gamer_tag})
  end

  def end_watch(%GamerTag{} = gamer_tag) do
    GenServer.call(__MODULE__, {:end_watch, gamer_tag})
  end

  # SERVER
  def init(_), do: {:ok, %{}}

  def handle_call({:start_watch, gamer_tag}, _from, state) do
    with :ok <- ProfileWatchList.add_to_list(gamer_tag),
         {:ok, _} <- ProfileWatcherServer.start_link(gamer_tag) do
      info "Starting to watch profile #{inspect get_gamer_tag_info(gamer_tag)}"

      {:reply, {:ok, gamer_tag}, state}
    else
      {:error, e} = error ->
        error "Start Watch error: #{inspect(e)}"

        {:reply, error, state}
      e ->
        error "Start Watch error: #{inspect(e)}"

        {:reply, {:error, e}, state}
    end
  end

  def handle_call({:end_watch, gamer_tag}, _from, state) do
    with :ok <- ProfileWatchList.remove_from_list(gamer_tag) do
      info "Ending profile watch #{inspect get_gamer_tag_info(gamer_tag)}"

      {:reply, {:ok, gamer_tag}, state}
    else
      {:error, e} = error ->
        error "End Watch error: #{inspect(e)}"
        {:reply, error, state}

      e ->
        error "End Watch error: #{inspect(e)}"

        {:reply, {:error, e}, state}
    end
  end

  defp get_gamer_tag_info(gamer_tag), do: Map.take(gamer_tag, [:id, :platform, :region, :tag])
end
