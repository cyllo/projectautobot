#! /usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..
pushd $ROOT_DIR/client &&
NODE_ENV='production' npm run build
popd
