#!/usr/bin/env bash
# Remove stale assets and old releases after a deploy has passed its smoke test.
#
#   ssh deploy bash -s -- <site-dir> <releases-dir> <release> <previous> <keep> < deploy/cleanup.sh
#
# Assets from the previous release are kept, so a visitor still on the old page
# can finish loading it. Only folders named like a release are ever deleted.
set -euo pipefail

site="$1"; releases="$2"; release="$3"; previous="$4"; keep="$5"

if [ -d "$site/assets" ]; then
  for file in "$site"/assets/*; do
    [ -e "$file" ] || continue
    name="${file##*/}"
    [ -e "$releases/$release/assets/$name" ] && continue
    [ -n "$previous" ] && [ -e "$releases/$previous/assets/$name" ] && continue
    rm -rf -- "$file"
    echo "Removed stale asset $name"
  done
fi

cd "$releases"
find . -mindepth 1 -maxdepth 1 -type d -printf '%f\n' \
  | grep -E '^[0-9]{14}-[0-9a-f]{7}$' | sort -r | tail -n +"$((keep + 1))" \
  | while read -r old; do
      [ "$old" = "$release" ] && continue
      [ "$old" = "$previous" ] && continue
      rm -rf -- "$old"
      echo "Removed release $old"
    done
