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

RUN \
  apt-get update && \
  curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
  apt-get install -y nodejs

RUN \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list


# Client
RUN apt-get update && apt-get install yarn

COPY ./client/package.json /home/client/package.json
RUN cd /home/client && NODE_ENV=development yarn
COPY ./client /home/client
RUN cd /home/client && npm run build

COPY ./release_scripts/move-client.sh home/release_scripts/
RUN /home/release_scripts/move-client.sh

# SERVER
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

RUN mix local.hex --force
RUN mix local.rebar --force

COPY ./server /home/server
RUN cd /home/server && mix deps.get
RUN cd /home/server && PATH=$HOME/.cargo/bin:$PATH mix release --env=prod

