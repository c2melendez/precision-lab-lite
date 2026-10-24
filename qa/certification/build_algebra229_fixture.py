#!/usr/bin/env python3
"""Build algebra229_fixture.jsonl from the frozen Markdown source (authoritative)."""
from __future__ import annotations
import gzip
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE_GZ = ROOT / "legacy_sources" / "matriz_algebra_simbolica.md.gz"
OUT = ROOT / "algebra229_fixture.jsonl"
EXPECTED_SHA256 = "8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7"
EXPECTED_ROWS = 229

OP_CMP = {
    "expandir": "equivalencia_simbolica",
    "factorizar": "forma_factorizada",
    "simplificar": "equivalencia_simbolica",
    "resolver": "conjunto_solucion",
    "desigualdad": "conjunto_solucion",
    "valor": "numerica_o_exacta",
    "fracciones_parciales": "equivalencia_simbolica",
    "division": "equivalencia_simbolica",
    "suma_serie": "equivalencia_simbolica",
    "convencion": "convencion_declarada",
}

def strip_ticks(s: str) -> str:
    s = s.strip()
    if s.startswith("`") and s.endswith("`") and s.count("`") == 2:
        return s[1:-1]
    if s.startswith("`"):
        s = s[1:]
    if s.endswith("`"):
        s = s[:-1]
    return s

def main() -> int:
    raw = gzip.decompress(SOURCE_GZ.read_bytes())
    digest = hashlib.sha256(raw).hexdigest()
    if digest != EXPECTED_SHA256:
        print(f"FAIL sha {digest}", file=sys.stderr)
        return 1
    text = raw.decode("utf-8")
    rows = []
    for line in text.splitlines():
        if not line.startswith("| AS-"):
            continue
        parts = [p.strip() for p in line.strip().strip("|").split("|")]
        if len(parts) < 5:
            continue
        id_, level, op, inp, exp = parts[0], parts[1], parts[2], parts[3], parts[4]
        note = parts[5] if len(parts) > 5 else ""
        if not re.match(r"AS-[A-L]-\d{2}$", id_):
            continue
        op_s = strip_ticks(op)
        exp_s = strip_ticks(exp)
        cmp_type = OP_CMP.get(op_s, "equivalencia_simbolica")
        low = exp_s.lower()
        if op_s == "convencion" or "ambiguo" in low:
            cmp_type = "convencion_declarada"
        if "error claro" in low:
            cmp_type = "aviso_de_error"
        section = id_.split("-")[1]
        rows.append({
            "id": id_,
            "matrix": "AS229",
            "section": section,
            "level": level,
            "operation": op_s,
            "comparison": cmp_type,
            "input": strip_ticks(inp),
            "expected": exp_s,
            "note": note,
            "source_sha256": EXPECTED_SHA256,
        })
    if len(rows) != EXPECTED_ROWS:
        print(f"FAIL rows {len(rows)}", file=sys.stderr)
        return 1
    if len({r["id"] for r in rows}) != EXPECTED_ROWS:
        print("FAIL non-unique ids", file=sys.stderr)
        return 1
    OUT.write_text(
        "\n".join(json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in rows) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"status": "BUILT", "rows": len(rows), "out": str(OUT)}, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
