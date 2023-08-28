#!/usr/bin/env bash

if [ ! -d ".git" ]
then
    echo "It's not a git repo, please run git init"
    exit 1
fi

mkdir -p .git/hooks

git submodule update --init

cp etc/hooks/* .git/hooks/
chmod +x .git/hooks/*
