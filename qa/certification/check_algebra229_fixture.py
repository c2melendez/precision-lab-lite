#!/usr/bin/env python3
"""Validate Algebra 229 fixture: rebuild from frozen MD, then check IDs."""
from __future__ import annotations
import gzip
import hashlib
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE_GZ = ROOT / "legacy_sources" / "matriz_algebra_simbolica.md.gz"
FIXTURE = ROOT / "algebra229_fixture.jsonl"
BUILDER = ROOT / "build_algebra229_fixture.py"
EXPECTED_SHA256 = "8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7"
EXPECTED_ROWS = 229
EXPECTED_SECTIONS = {
    "A": 17, "B": 30, "C": 23, "D": 9, "E": 26, "F": 18,
    "G": 35, "H": 23, "I": 18, "J": 12, "K": 7, "L": 11,
}
ROW = re.compile(r"^\|\s*(AS-([A-L])-\d{2})\s*\|\s*(N[123])\s*\|", re.MULTILINE)
ALLOWED_CMP = {
    "numerica_o_exacta", "equivalencia_simbolica", "forma_factorizada",
    "conjunto_solucion", "conjunto_salvo_escalares", "estructura",
    "convencion_declarada", "aviso_de_error",
}

def main() -> int:
    raw = gzip.decompress(SOURCE_GZ.read_bytes())
    digest = hashlib.sha256(raw).hexdigest()
    if digest != EXPECTED_SHA256:
        print(f"FAIL source sha {digest}", file=sys.stderr)
        return 1
    md_ids = [m.group(1) for m in ROW.finditer(raw.decode("utf-8"))]
    if len(md_ids) != EXPECTED_ROWS or len(set(md_ids)) != EXPECTED_ROWS:
        print("FAIL md ids", file=sys.stderr)
        return 1
    rc = subprocess.call([sys.executable, str(BUILDER)])
    if rc != 0:
        return rc
    rows = [json.loads(ln) for ln in FIXTURE.read_text(encoding="utf-8").splitlines() if ln.strip()]
    for r in rows:
        if "source" not in r and "source_sha256" in r:
            r["source"] = {"sha256": r["source_sha256"], "legacy_id": r["id"]}
    if len(rows) != EXPECTED_ROWS or {r["id"] for r in rows} != set(md_ids):
        print("FAIL fixture ids", file=sys.stderr)
        return 1
    sections = Counter(r["section"] for r in rows)
    if dict(sections) != EXPECTED_SECTIONS:
        print(f"FAIL sections {dict(sections)}", file=sys.stderr)
        return 1
    for r in rows:
        for key in ("id", "matrix", "section", "level", "operation", "comparison", "input", "expected"):
            if key not in r or r[key] in (None, ""):
                print(f"FAIL missing {key} on {r.get('id')}", file=sys.stderr)
                return 1
        if r["comparison"] not in ALLOWED_CMP:
            print(f"FAIL comparison {r['comparison']}", file=sys.stderr)
            return 1
    print(json.dumps({
        "status": "PASS_FIXTURE_INTEGRITY",
        "source_sha256": digest,
        "fixture_rows": len(rows),
        "sections": dict(sorted(sections.items())),
        "comparisons": dict(sorted(Counter(r["comparison"] for r in rows).items())),
    }, ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
