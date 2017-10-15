defmodule Models.Game.Hero do
  use Models.Model

  alias Ecto.Multi
  alias Models.Repo
  alias Models.Game.{Hero, HeroRole, HeroSkill}

  schema "heroes" do
    field :name, :string
    field :description, :string
    field :icon_portrait_url, :string
    field :select_portrait_url, :string
    belongs_to :role, HeroRole
    has_many :skills, HeroSkill

    timestamps(type: :utc_datetime)
  end

  @required_fields [:name, :description, :select_portrait_url]
  @allowed_fields Enum.concat(@required_fields, [])

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(%Hero{} = struct, params \\ %{}) do
    struct
      |> cast(params, @allowed_fields)
      |> validate_required(@required_fields)
      |> cast_assoc(:role)
      |> cast_assoc(:hero_skills)
      |> unique_constraint(:name)
      |> put_icon_portrait
  end

  def create_changeset(params), do: changeset(%Hero{}, params)

  def create_heroes_query(heroes, []) do
    heroes = Enum.map(heroes, &Utility.add_timestamps/1)

    Multi.new()
      |> Multi.insert_all(:heroes, Hero, heroes)
      |> Multi.run(:skills, fn %{heroes: {_, created_heroes}} ->
        serialize_skills_with_heroes(heroes, created_heroes)
          |> insert_all(HeroSkill)
      end)
      |> combine_heroes_props_in_multi
  end

  def create_heroes_query(heroes, roles) do
    heroes = Enum.map(heroes, &Utility.add_timestamps/1)

    Multi.new()
      |> Multi.insert_all(:roles, HeroRole, roles, returning: true)
      |> Multi.run(:heroes, fn %{roles: {_, roles}} ->
        serialize_hero_with_roles(heroes, roles)
          |> insert_all(Hero)
      end)
      |> Multi.run(:skills, fn %{heroes: created_heroes} ->
        serialize_skills_with_heroes(heroes, created_heroes)
          |> insert_all(HeroSkill)
      end)
      |> combine_heroes_props_in_multi
  end

  defp combine_heroes_props_in_multi(multi) do
    Multi.run(multi, :heroes_and_relations, fn %{heroes: heroes, roles: {_, roles}, skills: skills} ->
      skills_hero_map = Enum.group_by(skills, &Map.get(&1, :hero_id))

      heroes = heroes
        |> Repo.preload(:role)
        |> Enum.map(&Map.put(&1, :skills, skills_hero_map[&1.id]))

      {:ok, heroes}
    end)
  end

  defp insert_all(data, model) do
    with {_, data} <- Repo.insert_all(model, data, returning: true) do
      {:ok, data}
    else
      e -> {:error, e}
    end
  end

  defp serialize_hero_with_roles(heroes, roles) do
    roles_id_map = Utility.create_id_map(roles, :name, :id)

    heroes
      |> Enum.map(&Map.put(&1, :role_id, get_role_id(roles_id_map, &1)))
      |> Enum.map(&Map.put(&1, :icon_portrait_url, create_icon_portrait_url(&1.name)))
      |> Enum.map(&Map.take(&1, Hero.__schema__(:fields)))
  end

  defp get_role_id(role_id_map, %{role: %{name: name}}), do: role_id_map[name]
  defp get_role_id(_, %{role_id: role_id}), do: role_id

  def serialize_skills_with_heroes(heroes, created_heroes) do
    hero_name_id_map = Utility.create_id_map(created_heroes, :name, :id)

    heroes
      |> Enum.flat_map(fn %{skills: skills, name: hero_name} ->
        Enum.map(skills, &Map.put(&1, :hero_id, hero_name_id_map[hero_name]))
      end)
  end

  defp put_icon_portrait(changeset) do
    icon_portrait_url = get_field(changeset, :name)
      |> create_icon_portrait_url

    put_change(changeset, :icon_portrait_url, icon_portrait_url)
  end

  defp create_icon_portrait_name(hero_name), do: hero_name |> String.normalize(:nfd) |> String.replace(~r/[^A-z\s]/u, "") |> String.downcase
  defp create_icon_portrait_url(hero_name), do: "https://d1u1mce87gyfbn.cloudfront.net/hero/#{create_icon_portrait_name(hero_name)}/icon-portrait.png"
end
