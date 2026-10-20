#!/usr/bin/env python3
"""Verify all frozen legacy matrix sources against MANIFEST.json."""
from __future__ import annotations
import base64
import gzip
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LEGACY = ROOT / "legacy_sources"
MANIFEST = LEGACY / "MANIFEST.json"

def load_gz_bytes(stem_gz: str) -> bytes:
    gz_path = LEGACY / stem_gz
    b64_path = LEGACY / (stem_gz + ".b64")
    if gz_path.is_file():
        return gz_path.read_bytes()
    if b64_path.is_file():
        return base64.b64decode(b64_path.read_text().strip())
    raise FileNotFoundError(stem_gz)

def main() -> int:
    if not MANIFEST.is_file():
        print("FAIL: missing legacy_sources/MANIFEST.json", file=sys.stderr)
        return 1
    items = json.loads(MANIFEST.read_text(encoding="utf-8"))
    report = []
    for item in items:
        name = item["canonical_gz"]
        try:
            gz = load_gz_bytes(name)
            raw = gzip.decompress(gz)
        except Exception as exc:
            print(f"FAIL {item['key']}: {exc}", file=sys.stderr)
            return 1
        digest = hashlib.sha256(raw).hexdigest()
        if digest != item["sha256_raw"]:
            print(f"FAIL {item['key']}: sha {digest} != {item['sha256_raw']}", file=sys.stderr)
            return 1
        if len(raw) != item["bytes_raw"]:
            print(f"FAIL {item['key']}: bytes {len(raw)} != {item['bytes_raw']}", file=sys.stderr)
            return 1
        report.append({"key": item["key"], "status": "PASS", "sha256": digest, "bytes": len(raw)})
    print(json.dumps({"status": "PASS_LEGACY_SOURCES", "count": len(report), "items": report}, ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
