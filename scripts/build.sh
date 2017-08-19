#! /usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..
NODE_ENV='development'

pushd $ROOT_DIR &&
cd client && npm i && npm run build && cd .. && ./scripts/move-client.sh &&
docker build -t stp . &&
docker rm stp-container || true &&
docker create --name stp-container stp &&
docker cp stp-container:/home/server/_build/prod/rel/server/releases/0.1.0/server.tar.gz ./ &&
scp server.tar.gz stop@45.58.35.81:/home/stop &&
rm server.tar.gz &&
ssh -t stop@45.58.35.81 /bin/bash << EOF
  PORT=4000
  cd /home/stop &&
  tar -xzf server.tar.gz &&
  echo "Stoping Server..." &&
  ./bin/server stop || true &&
  echo "Migrating..." &&
  ./bin/server migrate &&
  echo "Starting Server..." &&
  PORT=4000 ./bin/server start &&
  echo "Server Started!"
EOF
popd
