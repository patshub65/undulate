#!/usr/bin/env bash
# View all three round 2 directions side by side without running Astro dev three times.
# Builds each design/r2-* branch once (in one hidden worktree, one after another), then serves
# the three static builds from a single Node process on ports 4341 to 4343. Ctrl+C stops it.
# A branch is only rebuilt when its latest commit changes. Uncommitted edits are not shown:
# for live editing, use `npm run dev` in your normal checkout.
#
# usage: bash design/rounds/r2/view.sh             build what changed, then serve
#        bash design/rounds/r2/view.sh --rebuild   rebuild all three, then serve
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(git -C "$HERE" rev-parse --show-toplevel)"
WORK="$ROOT/.r2-view"
BRANCHES="design/r2-1-run-sheet design/r2-2-grain design/r2-3-blockwork"
REBUILD=""; [ "${1:-}" = "--rebuild" ] && REBUILD=1
cd "$ROOT"

# Keep the build folder out of git status.
EXCLUDE="$(git rev-parse --git-path info/exclude)"
mkdir -p "$(dirname "$EXCLUDE")"
grep -qx '/.r2-view/' "$EXCLUDE" 2>/dev/null || echo '/.r2-view/' >> "$EXCLUDE"

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
  out="$WORK/dist-$n-${b#design/r2-[0-9]-}"
  ARGS="$ARGS $out:434$n"

  if [ -z "$REBUILD" ] && [ "$(cat "$out/.built-from" 2>/dev/null)" = "$sha" ]; then
    echo "[$n/3] $b is up to date (${sha:0:7})"
    continue
  fi
  echo "[$n/3] Building $b (${sha:0:7})..."
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
echo "Serving all three directions. Ctrl+C to stop."
exec node "$HERE/serve.cjs" $ARGS
