defmodule Models.Statistics.MatchAward do
  use Models.Model

  schema "match_award_statistics" do
    field :bronze_medals, :integer
    field :silver_medals, :integer
    field :gold_medals, :integer
    field :total_metals, :integer
    field :cards, :integer
  end
end
