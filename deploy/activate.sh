#!/usr/bin/env bash
# Publish a stored release into the domain's document root.
#
# Runs on the webspace, fed in over SSH by the deploy workflow:
#   ssh deploy bash -s -- <site-dir> <releases-dir> <release> < deploy/activate.sh
#
# Used both to go live and to roll back, so the two can never drift apart.
# Plain files rather than a `current -> releases/…` symlink: IONOS shared
# hosting will not accept a symlink as a domain's target folder.
#
# Prints PREVIOUS=<release> so the caller knows what to roll back to.
set -euo pipefail

site="$1"; releases="$2"; release="$3"
src="$releases/$release"
[ -f "$src/index.html" ] || { echo "$src/index.html is missing, refusing to publish." >&2; exit 1; }
mkdir -p "$site"

# 1. Hashed assets first. They are new files, so the index.html that is live
#    right now keeps working while they arrive.
if [ -d "$src/assets" ]; then
  mkdir -p "$site/assets"
  cp -a "$src/assets/." "$site/assets/"
fi

# 2. Every other file and folder except index.html (icons, .htaccess, ...).
find "$src" -mindepth 1 -maxdepth 1 ! -name assets ! -name index.html \
  -exec cp -a {} "$site/" \;

# 3. index.html last. A rename within one folder is atomic, so visitors get
#    the old page or the new one, never a partial file.
cp "$src/index.html" "$site/.index.html.next"
chmod a+r "$site/.index.html.next"
mv -f "$site/.index.html.next" "$site/index.html"

previous="$(cat "$releases/.live" 2>/dev/null || true)"
[ "$previous" = "$release" ] && previous="$(cat "$releases/.previous" 2>/dev/null || true)"
printf '%s\n' "$previous" > "$releases/.previous"
printf '%s\n' "$release" > "$releases/.live"
echo "PREVIOUS=$previous"
