#!/usr/bin/env bash
# Put the previous release back live, by hand.
#
# From a machine with SSH access to the webspace:
#   ssh <user>@<host> bash -s -- <site-dir> <releases-dir> < deploy/rollback.sh
#
# Every deploy keeps a copy of activate.sh at <releases-dir>/.bin/activate.sh,
# so this uses exactly the logic that published the release in the first place.
# The workflow rolls back on its own when a smoke test fails; this is for a
# problem found after a deploy passed.
set -euo pipefail

site="$1"; releases="$2"
previous="$(cat "$releases/.previous" 2>/dev/null || true)"
[ -n "$previous" ] || { echo "No previous release is recorded in $releases/.previous." >&2; exit 1; }
[ -d "$releases/$previous" ] || { echo "Release $previous is no longer on the server." >&2; exit 1; }
[ -f "$releases/.bin/activate.sh" ] || { echo "$releases/.bin/activate.sh is missing." >&2; exit 1; }

echo "Rolling back to $previous"
bash "$releases/.bin/activate.sh" "$site" "$releases" "$previous"
