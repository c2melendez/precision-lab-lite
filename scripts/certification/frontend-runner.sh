#!/usr/bin/env bash
# Shared STEM frontend runner v1. Only execute named, existing npm phases.
# Deliberately does not decide REUSE, skip tests or certify a gate.
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage: frontend-runner.sh install|typecheck|test|build" >&2
  exit 64
fi
case "$1" in
  install) args=(ci) ;;
  typecheck) args=(run typecheck) ;;
  test) args=(test) ;;
  build) args=(run build) ;;
  *) echo "Unsupported frontend phase" >&2; exit 64 ;;
esac
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd -P)"
cwd="$(pwd -P)"
if [[ "$cwd" != "$root" && "$cwd" != "$root/frontend" ]]; then
  echo "Unexpected frontend working directory" >&2
  exit 65
fi
if [[ ! -f package.json || ! -f package-lock.json ]]; then
  echo "Missing package manifest or lockfile" >&2
  exit 66
fi
printf 'STEM frontend phase=%s checkout=%s node=%s npm=%s\n' "$1" "$(git -C "$root" rev-parse HEAD)" "$(node --version)" "$(npm --version)"
printf 'Lockfile SHA256: '
sha256sum package-lock.json
exec npm "${args[@]}"
