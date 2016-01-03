defmodule Client.Mixfile do
  use Mix.Project

  def project do
    [
      app: :client,
      version: "1.0.0",
      deps: deps
    ]
  end

  def application do
    [
      applications: [:cowboy, :plug, :logger],
      mod: {Client, []}
    ]
  end

  defp deps do
    [
       {:plug, "~> 1.0.0"},
       {:cowboy, "~> 1.0.0"}
    ]
  end
end
