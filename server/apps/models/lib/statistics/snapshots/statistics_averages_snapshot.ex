defmodule Models.Statistics.Snapshots.StatisticsAveragesSnapshot do
  use Models.Model

  alias Models.Statistics.Snapshots.StatisticsAveragesSnapshot

  schema "statistics_averages_snapshots" do
    field :hero_total_competitive_averages, :map
    field :hero_total_quickplay_averages, :map
    field :hero_competitive_averages, {:array, :map}
    field :hero_quickplay_averages, {:array, :map}

    timestamps(type: :utc_datetime)
  end

  @required_fields [
    :hero_total_competitive_averages,
    :hero_total_quickplay_averages,
    :hero_competitive_averages,
    :hero_quickplay_averages
  ]

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%StatisticsAveragesSnapshot{} = struct, params \\ %{}) do
    struct
      |> cast(params, @required_fields)
      |> validate_required(@required_fields)
  end

  def create_changeset(params), do: changeset(%StatisticsAveragesSnapshot{}, params)

  def latest_snapshot_query(query \\ from(StatisticsAveragesSnapshot)) do
    query
      |> Ecto.Query.last(:inserted_at)
  end
end
