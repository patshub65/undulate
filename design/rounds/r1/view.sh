#!/usr/bin/env bash
# View all five round 1 directions side by side without running Astro dev five times.
# Builds each design/* branch once (in one hidden worktree, one after another), then serves
# the five static builds from a single Node process on ports 4331 to 4335. Ctrl+C stops it.
# A branch is only rebuilt when its latest commit changes. Uncommitted edits are not shown:
# for live editing, use `npm run dev` in your normal checkout.
#
# usage: bash design/rounds/r1/view.sh             build what changed, then serve
#        bash design/rounds/r1/view.sh --rebuild   rebuild all five, then serve
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(git -C "$HERE" rev-parse --show-toplevel)"
WORK="$ROOT/.r1-view"
BRANCHES="design/1-after-dark design/2-gallery-sand design/3-poster design/4-gradient-wave design/5-editorial"
REBUILD=""; [ "${1:-}" = "--rebuild" ] && REBUILD=1
cd "$ROOT"

# Keep the build folder out of git status.
EXCLUDE="$(git rev-parse --git-path info/exclude)"
mkdir -p "$(dirname "$EXCLUDE")"
grep -qx '/.r1-view/' "$EXCLUDE" 2>/dev/null || echo '/.r1-view/' >> "$EXCLUDE"

echo "Fetching the design branches..."
git fetch -q origin $BRANCHES 2>/dev/null || echo "  (fetch failed, using the branches you already have)"

if [ ! -e "$WORK/src/.git" ]; then
  git worktree prune
  git worktree add -q --detach "$WORK/src" HEAD
fi

n=0; ARGS=""
for b in $BRANCHES; do
  n=$((n + 1))
  # Use whichever of your local branch and origin's is newer.
  ref=""
  git rev-parse -q --verify "origin/$b" >/dev/null && ref="origin/$b"
  if git rev-parse -q --verify "refs/heads/$b" >/dev/null; then
    if [ -z "$ref" ] || ! git merge-base --is-ancestor "$b" "origin/$b"; then ref="$b"; fi
  fi
  [ -n "$ref" ] || { echo "Branch $b not found."; exit 1; }
  sha="$(git rev-parse "$ref")"
  out="$WORK/dist-$n-${b#design/[0-9]-}"
  ARGS="$ARGS $out:433$n"

  if [ -z "$REBUILD" ] && [ "$(cat "$out/.built-from" 2>/dev/null)" = "$sha" ]; then
    echo "[$n/5] $b is up to date (${sha:0:7})"
    continue
  fi
  echo "[$n/5] Building $b (${sha:0:7})..."
  git -C "$WORK/src" checkout -q -f --detach "$sha"
  git -C "$WORK/src" clean -q -fd -e node_modules
  if ! (cd "$WORK/src" && npm install --no-audit --no-fund --loglevel=error && npm run build) > "$WORK/build-$n.log" 2>&1; then
    tail -30 "$WORK/build-$n.log"
    echo "Build of $b failed. Full log: $WORK/build-$n.log"
    exit 1
  fi
  rm -rf "$out"
  cp -R "$WORK/src/dist" "$out"
  echo "$sha" > "$out/.built-from"
done

echo
echo "Serving all five directions. Ctrl+C to stop."
exec node "$HERE/serve.cjs" $ARGS
