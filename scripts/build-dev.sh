#! /usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..
docker build  --file=$ROOT_DIR/Dockerfile.dev  -t stp-dev $ROOT_DIR &&
docker run -p 4000:4000 -v server:/home/server --name stp-dev stp-dev
