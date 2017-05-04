#! /usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..
SERVER_DIR=$ROOT_DIR/server
CLIENT_DIR=$ROOT_DIR/client
INDEX_DIR=$SERVER_DIR/apps/api/lib/web/templates/layout
ASSETS_DIR=$SERVER_DIR/apps/api/priv/static

pushd $CLIENT_DIR &&
yarn &&
npm run build &&
echo "Moving client build to server...." &&
rm -rf $INDEX_DIR &&
mkdir -p $INDEX_DIR &&
mv dist/index.html $INDEX_DIR/app.html.eex &&
rm -rf $ASSETS_DIR &&
mkdir $ASSETS_DIR &&
mv dist/* $ASSETS_DIR &&
popd &&
pushd $SERVER_DIR &&
MIX_ENV=prod mix release --env=prod
