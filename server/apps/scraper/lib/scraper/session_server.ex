defmodule Scraper.SessionServer do
  use GenServer
  use Hound.Helpers
  alias Scraper.DataProcessor.Helpers

  @check_for_loaded_interval 500
  @retries_before_refresh 5
  @refresh_sleep_time 2000

  # API
  def start_link(_), do: start_link()
  def start_link do
    GenServer.start_link(__MODULE__, [])
  end

  def start_session(pid), do: GenServer.call pid, :start_session
  def end_session(pid), do: GenServer.cast pid, :end_session
  def navigate_to(pid, url), do: GenServer.call pid, {:navigate_to, url}, :infinity
  def page_source(pid), do: GenServer.call pid, :get_page_source

  # SERVER
  def init(_) do
    Process.flag :trap_exit, true

    {:ok, %{}}
  end

  def handle_cast(:end_session, state) do
    Hound.end_session self()

    {:noreply, state}
  end

  def handle_call(:start_session, _from, state) do
    Hound.start_session

    reply_ok(state)
  end

  def handle_call(:get_page_source, _from, state) do
    reply_ok(state, {:ok, page_source()})
  end

  def handle_call({:navigate_to, url}, _from, state) do
    navigate_to url

    sleep_till_loaded(url)

    reply_ok(state)
  end

  def terminate(_, _) do
    Hound.end_session self()
  end

  defp sleep_till_loaded(url), do: sleep_till_loaded(url, page_source())
  defp sleep_till_loaded(url, source, retries \\ @retries_before_refresh) do
    cond do
      retries < 0 ->
        IO.puts "Refreshing Page"
        refresh_page
        Process.sleep @refresh_sleep_time
        sleep_till_loaded(url)

      !Helpers.is_page_loaded?(source) ->
        Process.sleep @check_for_loaded_interval
        sleep_till_loaded(url, source, retries - 1)

      true -> nil
    end
  end

  defp reply_ok(state, resp \\ :ok), do: {:reply, resp, state}
end
