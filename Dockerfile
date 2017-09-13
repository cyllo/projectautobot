FROM mikaak/elixir-rust:1.5-alpine

WORKDIR /home

# Add mix files
COPY ./server/config/* ./config/
COPY ./server/apps/api/mix.exs ./apps/api/
COPY ./server/apps/api/config ./apps/api/config
COPY ./server/apps/battle_net/mix.exs ./apps/battle_net/
COPY ./server/apps/battle_net/config ./apps/battle_net/config
COPY ./server/apps/models/mix.exs ./apps/models/
COPY ./server/apps/models/config ./apps/models/config
COPY ./server/apps/profile_watch/mix.exs ./apps/profile_watch/
COPY ./server/apps/profile_watch/config ./apps/profile_watch/config
COPY ./server/apps/scraper/mix.exs ./apps/scraper/
COPY ./server/apps/scraper/config ./apps/scraper/config
COPY ./server/apps/heroes_scraper/mix.exs ./apps/heroes_scraper/
COPY ./server/apps/heroes_scraper/config ./apps/heroes_scraper/config
COPY ./server/apps/snapshot_stats_differ/mix.exs ./apps/snapshot_stats_differ/
COPY ./server/apps/snapshot_stats_differ/config ./apps/snapshot_stats_differ/config
COPY ./server/apps/stats_averages/mix.exs ./apps/stats_averages/
COPY ./server/apps/stats_averages/config ./apps/stats_averages/config
COPY ./server/apps/stats_leaderboard/mix.exs ./apps/stats_leaderboard/
COPY ./server/apps/stats_leaderboard/config ./apps/stats_leaderboard/config
COPY ./server/apps/utility/mix.exs ./apps/utility/
COPY ./server/apps/utility/config ./apps/utility/config
COPY ./server/mix.exs server/mix.lock ./

RUN mix do deps.get, compile

RUN rm -rf ./apps
COPY ./server/rel ./rel
COPY ./server/apps ./apps

# Install Deps and Release
RUN rm -rf {deps,_build} && mix do deps.get, phx.digest, release --env=prod

# For Build split
# COPY ./server.tar.gz ./
# RUN ["tar", "xzf", "server.tar.gz"]
# ENTRYPOINT ["/home/bin/server"]
# CMD ["foreground"]

ENV PORT 4000
ENV REPLACE_OS_VARS true
EXPOSE 4000

ENTRYPOINT ["/home/_build/prod/rel/server/bin/server"]
CMD ["foreground"]
