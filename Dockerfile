FROM ubuntu:16.10

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV MIX_ENV prod
ENV NODE_ENV production
ENV PATH /home/asdf/.asdf/bin:/home/asdf/.asdf/shims:$PATH

RUN \
  locale-gen en_US.UTF-8 && \
  update-locale LANG=en_US.UTF-8 && \
  ln -sfn /usr/share/zoneinfo/America/Vancouver /etc/localtime

RUN \
  apt-get update && \
  apt-get install -y \
    build-essential openssh-server git libtinfo-dev unzip \
    libncurses5-dev libssl-dev inotify-tools wget curl git && \
  rm -rf /var/lib/apt/lists/*

RUN useradd -ms $(which bash) asdf

USER asdf


RUN /bin/bash -c "git clone https://github.com/asdf-vm/asdf.git ~/.asdf && \
                  asdf plugin-add erlang https://github.com/asdf-vm/asdf-erlang.git && \
                  asdf install erlang 20.0 && \
                  asdf global erlang 20.0 && \
                  rm -rf  /tmp/*"

RUN /bin/bash -c "asdf plugin-add elixir https://github.com/asdf-vm/asdf-elixir.git && \
                  asdf install elixir 1.4.5 && \
                  asdf global elixir 1.4.5 && \
                  rm -rf  /tmp/*"


RUN ["/bin/bash", "-c", "source ~/.bashrc && mix local.hex --force && mix local.rebar --force"]
USER root

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH $HOME/.cargo/bin:$PATH

# SERVER
COPY ./server /home/server
RUN \
  cd /home/server && \
  asdf global elixir 1.4.5 && \
  asdf global erlang 20.0 && \
  PATH=$HOME/.cargo/bin:$PATH MIX_ENV=prod mix deps.get

RUN \
  cd /home/server && \
  PATH=$HOME/.cargo/bin:$PATH MIX_ENV=prod mix release --env=prod

