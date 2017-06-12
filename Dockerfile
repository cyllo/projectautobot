FROM ubuntu:16.10

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV MIX_ENV prod
ENV NODE_ENV production

RUN \
  apt-get update && \
  apt-get install -y wget curl

RUN \
  locale-gen en_US.UTF-8 && \
  update-locale LANG=en_US.UTF-8 && \
  ln -sfn /usr/share/zoneinfo/America/Vancouver /etc/localtime

RUN \
  wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb && \
  dpkg -i erlang-solutions_1.0_all.deb && \
  apt-get update && \
  apt-get install -y esl-erlang elixir build-essential openssh-server git

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH $HOME/.cargo/bin:$PATH

RUN mix local.hex --force
RUN mix local.rebar --force

# SERVER
COPY ./server /home/server
RUN cd /home/server && mix do deps.get, phx.digest
RUN cd /home/server && PATH=$HOME/.cargo/bin:$PATH MIX_ENV=prod mix release --env=prod

