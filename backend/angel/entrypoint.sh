#!/usr/bin/env bash

export START_SCRIPT=${START_SCRIPT:-"start"}

if [ "${1:0:1}" = '-' ]; then
    set -- npm run "${START_SCRIPT}" "$@"
fi

if [ $# -eq 0 ]; then
    set -- npm run "${START_SCRIPT}"
fi

umask 002
exec "$@"