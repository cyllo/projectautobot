defmodule Scraper.Sorter do
  alias Scraper.Sorter.{GeneralStats, HeroesStats}
  require Logger

  def sort_stats(params) do
    Logger.info "Sorting #{params.gamer_tag} stats"

    %{params |
      competitive: update_stats(params.competitive),
      quickplay: update_stats(params.quickplay)
    }
  end

  defp update_stats(stats) do
    %{stats |
      heroes_stats: HeroesStats.sort_stats(stats.heroes_stats),
      general_stats: GeneralStats.sort_stats(stats.general_stats)
    }
  end
end
