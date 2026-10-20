#!/usr/bin/env python3
"""Validate canonical Algebra 229 fixture against frozen Markdown source."""
from __future__ import annotations
import gzip, hashlib, json, re, sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE_GZ = ROOT / "legacy_sources" / "matriz_algebra_simbolica.md.gz"
FIXTURE = ROOT / "algebra229_fixture.jsonl"
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
        print(f"FAIL: source sha {digest}", file=sys.stderr)
        return 1
    text = raw.decode("utf-8")
    md_ids = [m.group(1) for m in ROW.finditer(text)]
    if len(md_ids) != EXPECTED_ROWS or len(set(md_ids)) != EXPECTED_ROWS:
        print(f"FAIL: md id count {len(md_ids)} unique {len(set(md_ids))}", file=sys.stderr)
        return 1
    lines = [ln for ln in FIXTURE.read_text(encoding="utf-8").splitlines() if ln.strip()]
    if len(lines) != EXPECTED_ROWS:
        print(f"FAIL: fixture lines {len(lines)}", file=sys.stderr)
        return 1
    rows = [json.loads(ln) for ln in lines]
    ids = [r["id"] for r in rows]
    if len(set(ids)) != EXPECTED_ROWS or set(ids) != set(md_ids):
        print("FAIL: fixture IDs != source IDs", file=sys.stderr)
        return 1
    sections = Counter(r["section"] for r in rows)
    if dict(sections) != EXPECTED_SECTIONS:
        print(f"FAIL: sections {dict(sections)}", file=sys.stderr)
        return 1
    for r in rows:
        for key in ("id", "matrix", "section", "level", "operation", "comparison", "input", "expected"):
            if key not in r or r[key] in (None, ""):
                print(f"FAIL: missing {key} on {r.get('id')}", file=sys.stderr)
                return 1
        if r["matrix"] != "AS229":
            print(f"FAIL: matrix field {r['matrix']}", file=sys.stderr)
            return 1
        if r["comparison"] not in ALLOWED_CMP:
            print(f"FAIL: comparison {r['comparison']} on {r['id']}", file=sys.stderr)
            return 1
        if r["source"]["sha256"] != EXPECTED_SHA256:
            print(f"FAIL: row source sha on {r['id']}", file=sys.stderr)
            return 1
    report = {
        "status": "PASS_FIXTURE_INTEGRITY",
        "source_sha256": digest,
        "fixture_rows": len(rows),
        "unique_ids": len(set(ids)),
        "sections": dict(sorted(sections.items())),
        "comparisons": dict(sorted(Counter(r["comparison"] for r in rows).items())),
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
