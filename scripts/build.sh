#! /usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..
pushd $ROOT_DIR &&
cd client && npm i && NODE_ENV='production' npm run build && cd .. &&
docker build -t stp . &&
docker tag stp:latest 403845358116.dkr.ecr.us-west-2.amazonaws.com/stp:latest &&
aws ecr get-login --no-include-email --region us-west-2 | bash &&
docker push 403845358116.dkr.ecr.us-west-2.amazonaws.com/stp:latest
popd
