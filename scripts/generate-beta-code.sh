#! /usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..

pushd $ROOT_DIR &&
ssh -t stop@45.58.35.81 /bin/bash << EOF
  . /home/stop/.bashrc &&
  . /home/stop/.asdf/asdf.sh &&
  asdf global erlang 20.0 &&
  asdf global elixir 1.4.5 &&
  PORT=4000 MIX_ENV=prod /home/stop/bin/server rpc Elixir.Api.BetaToken create_invite_code
EOF
popd
