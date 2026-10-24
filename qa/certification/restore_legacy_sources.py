#!/usr/bin/env python3
"""Materialize legacy_sources/*.md.gz from *.md.gz.b64 when binary gz is absent."""
from __future__ import annotations
import base64
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "legacy_sources"

def main() -> int:
    if not ROOT.is_dir():
        print("FAIL: no legacy_sources/", file=sys.stderr)
        return 1
    n = 0
    for b64 in sorted(ROOT.glob("*.md.gz.b64")):
        target = Path(str(b64)[:-4])
        if target.is_file():
            continue
        target.write_bytes(base64.b64decode(b64.read_text().strip()))
        n += 1
        print(f"restored {target.name}")
    print(json.dumps({"restored": n}))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
