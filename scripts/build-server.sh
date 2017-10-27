#! /usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$DIR/..
pushd $ROOT_DIR &&
docker build -t stop-the-payload . &&
docker tag stop-the-payload:latest 403845358116.dkr.ecr.us-west-2.amazonaws.com/stop-the-payload:latest &&
aws ecr get-login --no-include-email --region us-west-2 | bash &&
docker push 403845358116.dkr.ecr.us-west-2.amazonaws.com/stop-the-payload:latest
popd
