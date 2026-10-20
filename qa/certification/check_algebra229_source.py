#!/usr/bin/env python3
"""Integrity check and lossless recovery for the normative Algebra 229 source."""
from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "legacy_sources" / "matriz_algebra_simbolica.md.gz"
EXPECTED_SHA256 = "8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7"
EXPECTED_ROWS = 229
EXPECTED_LEVELS = {"N1": 43, "N2": 132, "N3": 54}
EXPECTED_SECTIONS = {
    "A": 17, "B": 30, "C": 23, "D": 9, "E": 26, "F": 18,
    "G": 35, "H": 23, "I": 18, "J": 12, "K": 7, "L": 11,
}
ROW = re.compile(r"^\|\s*(AS-([A-L])-\d{2})\s*\|\s*(N[123])\s*\|", re.MULTILINE)


def validate() -> tuple[bytes, dict]:
    if not SOURCE.is_file():
        raise FileNotFoundError(f"Missing frozen source: {SOURCE}")
    raw = gzip.decompress(SOURCE.read_bytes())
    digest = hashlib.sha256(raw).hexdigest()
    if digest != EXPECTED_SHA256:
        raise ValueError(f"SHA-256 mismatch: expected {EXPECTED_SHA256}, got {digest}")
    text = raw.decode("utf-8")
    rows = ROW.findall(text)
    ids = [row[0] for row in rows]
    if len(rows) != EXPECTED_ROWS:
        raise ValueError(f"Expected {EXPECTED_ROWS} source rows, found {len(rows)}")
    if len(set(ids)) != EXPECTED_ROWS:
        duplicates = sorted(k for k, v in Counter(ids).items() if v > 1)
        raise ValueError(f"Source IDs are not unique; duplicates={duplicates}")
    levels = Counter(row[2] for row in rows)
    sections = Counter(row[1] for row in rows)
    if dict(levels) != EXPECTED_LEVELS:
        raise ValueError(f"Level counts differ: {dict(levels)}")
    if dict(sections) != EXPECTED_SECTIONS:
        raise ValueError(f"Section counts differ: {dict(sections)}")
    expected_sections = {f"AS-{letter}-{i:02d}" for letter, count in EXPECTED_SECTIONS.items() for i in range(1, count + 1)}
    if set(ids) != expected_sections:
        missing = sorted(expected_sections - set(ids))
        unexpected = sorted(set(ids) - expected_sections)
        raise ValueError(f"ID range mismatch; missing={missing}, unexpected={unexpected}")
    return raw, {
        "status": "PASS_SOURCE_INTEGRITY",
        "sha256": digest,
        "bytes": len(raw),
        "rows": len(rows),
        "unique_ids": len(set(ids)),
        "levels": dict(sorted(levels.items())),
        "sections": dict(sorted(sections.items())),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--restore", nargs="?", const="", help="write the validated original Markdown beside the gzip or to a specified path")
    args = parser.parse_args()
    try:
        raw, report = validate()
        if args.restore is not None:
            target = Path(args.restore) if args.restore else SOURCE.with_suffix("")
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
            report["restored_to"] = str(target)
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 0
    except Exception as exc:
        print(f"FAIL_SOURCE_INTEGRITY: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
