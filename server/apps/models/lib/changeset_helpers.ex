defmodule Models.ChangesetHelpers do
  import Ecto.Changeset, only: [update_change: 3]

  def update_changes(changeset, keys, fun) do
    Enum.reduce(keys, changeset, fn (item, acc) ->
      update_change(acc, item, fun)
    end)
  end
end
