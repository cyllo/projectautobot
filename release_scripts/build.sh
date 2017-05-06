#! /usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..

pushd $ROOT_DIR &&
docker build -t stp . &&
docker rm stp-container || true &&
docker create --name stp-container stp &&
docker cp stp-container:/home/server/_build/prod/rel/server/releases/0.1.0/server.tar.gz ./ &&
scp server.tar.gz root@45.58.35.81:/root &&
rm server.tar.gz &&
ssh root@45.58.35.81 << EOF
  cd ~ &&
  tar -xzf server.tar.gz &&
  PORT 4000 bin/server stop &&
  PORT 4000 bin/server migrate &&
  PORT 4000 bin/server start &&
EOF
popd
