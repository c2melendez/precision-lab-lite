#!/usr/bin/env python3
"""Derive `matrices_ejecutables.jsonl` from the frozen MV153 source.

The frozen source is `qa/certification/legacy_sources/matriz_matrices_vectores.md.gz`
(sha256 pinned in MANIFEST.json). This script only extracts the table rows and
normalizes the documented JSONL fields; it never computes or alters an oracle.

Usage (from the repository root):

    python3 qa/certification/derive_matrices_ejecutables.py
"""
from __future__ import annotations

import gzip
import json
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE_GZ = HERE / "legacy_sources" / "matriz_matrices_vectores.md.gz"
OUTPUT = HERE / "matrices_ejecutables.jsonl"

EXPECTED_SECTIONS = {"A": 25, "B": 22, "C": 19, "D": 17, "E": 12, "F": 17, "G": 22, "H": 12, "J": 7}

# The comparison type is derived from the documented operation, never from the
# expected value.
COMPARISON_BY_OPERATION = {
    "error": "aviso_de_error",
    "resolver": "conjunto_solucion",
    "propios": "conjunto_salvo_escalares",
}


def uncode(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value.startswith("`") and value.endswith("`"):
        return value[1:-1].strip()
    return value


def parse_rows(text: str) -> list[dict]:
    section = None
    rows: list[dict] = []
    for line in text.splitlines():
        header = re.match(r"^##\s+MV-([A-Z])\s*\.", line)
        if header:
            section = header.group(1)
            continue
        if not line.startswith("| MV-") or re.match(r"^\|\s*MV-[A-Z]\s*·", line):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) != 6:
            raise SystemExit(f"unexpected row shape: {line[:120]}")
        case_id, level, operation, entry, expected, note = cells
        if not re.fullmatch(r"MV-[A-Z]-\d{2}", case_id):
            raise SystemExit(f"unexpected id: {case_id}")
        operation = uncode(operation)
        rows.append({
            "matriz": "MV",
            "seccion": section,
            "id": case_id,
            "nivel": level,
            "operacion": operation,
            "comparacion": COMPARISON_BY_OPERATION.get(operation, "numerica_o_exacta"),
            "entrada": uncode(entry),
            "esperado": uncode(expected),
            "nota": note,
        })
    return rows


def main() -> int:
    text = gzip.decompress(SOURCE_GZ.read_bytes()).decode("utf-8")
    rows = parse_rows(text)
    counts = Counter(row["seccion"] for row in rows)
    if len(rows) != 153 or dict(counts) != EXPECTED_SECTIONS:
        print(f"invalid derivation: {len(rows)} rows, {dict(counts)}", file=sys.stderr)
        return 1
    OUTPUT.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {OUTPUT} ({len(rows)} rows)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
