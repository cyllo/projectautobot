defmodule StaticPageController do
  use Api.Web, :controller

  def index(conn, _) do
    Phoenix.Controller.render(conn, "index.html")
  end
end
