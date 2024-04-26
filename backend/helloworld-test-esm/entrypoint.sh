#!/usr/bin/env bash

export NODE_SCRIPT=${NODE_SCRIPT:-"start"}

if [ "${1:0:1}" = '-' ]; then
    set -- npm run "${NODE_SCRIPT}" "$@"
fi

if [ $# -eq 0 ]; then
    set -- npm run "${NODE_SCRIPT}"
fi

umask 002
exec "$@"