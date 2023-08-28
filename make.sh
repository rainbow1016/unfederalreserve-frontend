#!/bin/sh

SERVICE=lending-ts


case $1 in

run)
  yarn serve
  ;;

install)
  yarn install --frozen-lockfile --silent
  ;;

lint)
  yarn audit:check
  yarn lint
  ;;

tests)
  yarn unit
  ;;

build)
  SHORT_SHA=$SHORT_SHA BRANCH_NAME=$BRANCH_NAME yarn build --mode $BRANCH_NAME
  ;;

help)
  cat make.sh | grep "^[a-z-]*)"
  ;;

*)
  echo "unknown $1, try help"
  ;;

esac
