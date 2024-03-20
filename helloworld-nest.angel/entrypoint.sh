#!/usr/bin/env bash

export PACKAGE_SCRIPT=${PACKAGE_SCRIPT:-"start"}

if [ "${1:0:1}" = '-' ]; then
    set -- npm run "${PACKAGE_SCRIPT}" "$@"
fi

if [ $# -eq 0 ]; then
    set -- npm run "${PACKAGE_SCRIPT}"
fi

umask 002
exec "$@"