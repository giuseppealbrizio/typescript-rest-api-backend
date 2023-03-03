#!/bin/bash

Check kubectl context
CURRENT_CONTEXT=$(kubectl config current-context)
if [ "$CURRENT_CONTEXT" != "docker-desktop" ]; then
echo "Please set kubectl context to docker-desktop before running this script."
exit 1
fi

Set the options
NO_PRUNE=false
CACHE_ARTIFACTS=false

Parse the options
while getopts ":npca" opt; do
case $opt in
n) NO_PRUNE=true ;;
p) NO_PRUNE=false ;;
c) CACHE_ARTIFACTS=true ;;
a) CACHE_ARTIFACTS=false ;;
?) echo "Invalid option: -$OPTARG" >&2 ;;
esac
done

Run the skaffold dev command with the options
skaffold dev --no-prune=$NO_PRUNE --cache-artifacts=$CACHE_ARTIFACTS
