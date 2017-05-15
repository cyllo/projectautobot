#! /usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..
SERVER_DIR=$ROOT_DIR/server
CLIENT_DIR=$ROOT_DIR/client
INDEX_DIR=$SERVER_DIR/apps/api/lib/api/web/templates/layout
ASSETS_DIR=$SERVER_DIR/apps/api/priv/static

pushd $CLIENT_DIR &&
echo "Moving client build to server...." &&
rm -rf $INDEX_DIR &&
mkdir -p $INDEX_DIR &&
touch $INDEX_DIR/app.html.eex &&
mv dist/index.html $INDEX_DIR/app.html.eex &&
rm -rf $ASSETS_DIR &&
mkdir -p $ASSETS_DIR &&
mv dist/* $ASSETS_DIR &&
echo "Move Complete"
popd
