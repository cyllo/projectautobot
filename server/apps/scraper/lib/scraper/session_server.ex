defmodule Scraper.SessionServer do
  use GenServer
  use Hound.Helpers
  require Logger
  alias Scraper.HtmlHelpers

  @check_for_loaded_interval 500
  @navigation_timeout 1000
  @retries_before_refresh 5
  @session_restarts_before_timeout 3

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

    reply_ok state
  end

  def handle_call(:get_page_source, _from, state) do
    reply_ok state, {:ok, page_source()}
  end

  def handle_call({:navigate_to, url}, _from, state) do
    navigate_to url

    Process.sleep @navigation_timeout

    sleep_till_loaded url

    reply_ok state
  end

  def terminate(_, _) do
    Hound.end_session self()
  end

  defp sleep_till_loaded(
    url,
    session_restart_retries \\ @session_restarts_before_timeout,
    retries \\ @retries_before_refresh
  ) do
    source = page_source()
    page_loaded? = HtmlHelpers.is_page_loaded?(source)

    cond do
      page_loaded? ->
        nil

      retries === 0 && session_restart_retries === 0 ->
        Logger.error("Server unable to load stats after restarting session #{@session_restarts_before_timeout} times")
        nil

      retries <= 0 && session_restart_retries >= 0 ->
        restart_session url
        Process.sleep @navigation_timeout
        sleep_till_loaded url, session_restart_retries - 1

      !page_loaded? ->
        Process.sleep @check_for_loaded_interval
        sleep_till_loaded url, session_restart_retries, retries - 1
    end
  end

  def restart_session(url) do
    Logger.debug "Restarting Session"

    Hound.end_session self()
    Hound.start_session
    navigate_to url
  end

  defp reply_ok(state, resp \\ :ok), do: {:reply, resp, state}
end
