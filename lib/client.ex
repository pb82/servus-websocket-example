defmodule Assets do
  use Plug.Builder

  plug Plug.Static, at: "/assets", from: :client
end

defmodule Router do
  @index File.read! "priv/static/index.html"

  use Plug.Router

  plug :match
  plug :dispatch

  get "/" do
    conn
    |> put_resp_content_type("text/html")
    |> send_resp(200, @index)
  end

  match _ do
    send_resp conn, 404, "not found"
  end
end

defmodule App do
  use Plug.Builder

  plug Assets
  plug Router
end

defmodule Client do
  @port 4000

  use Application
  require Logger

  def start(_, _) do
    Logger.info "Running app on port #{@port}"
    Plug.Adapters.Cowboy.http App, [], port: @port
  end
end
