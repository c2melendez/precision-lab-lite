#!/usr/bin/env python3
"""Import all Matrices.zip sources into qa/certification/legacy_sources/ with SHA check.

Usage:
  python3 qa/certification/import_from_matrices_zip.py /path/to/Matrices.zip

Writes canonical *.md.gz files listed in legacy_sources/MANIFEST.json.
Does not invent rows or execute cases.
"""
from __future__ import annotations
import gzip
import hashlib
import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LEGACY = ROOT / "legacy_sources"
MANIFEST = LEGACY / "MANIFEST.json"

ZIP_TO_KEY = {
    "matriz_algebra_simbolica.md": "AS229",
    "matriz_sintaxis_entrada.md": "IN309",
    "matriz_entrada_sintaxis_calculadora.md": "IN625",
    "ejercicios_trigonometria_calculadora.md": "TR324",
    "matriz_log_exp_radicales_calculadora.md": "LER",
    "matriz_matrices_vectores.md": "MV153",
    "matriz_edo_variable_compleja_calculadora.md": "EDCX",
    "matriz_graficacion_calculadora.md": "GR519",
}

def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: import_from_matrices_zip.py /path/to/Matrices.zip", file=sys.stderr)
        return 2
    zip_path = Path(sys.argv[1])
    if not zip_path.is_file():
        print(f"FAIL: not a file {zip_path}", file=sys.stderr)
        return 1
    items = {it["key"]: it for it in json.loads(MANIFEST.read_text(encoding="utf-8"))}
    LEGACY.mkdir(parents=True, exist_ok=True)
    written = []
    with zipfile.ZipFile(zip_path, "r") as zf:
        for member in zf.namelist():
            base = Path(member).name
            key = ZIP_TO_KEY.get(base)
            if key is None and ("lgebra" in base or "simb" in base.lower()) and base != "matriz_algebra_simbolica.md":
                key = "AS114"
            if key is None:
                continue
            meta = items[key]
            raw = zf.read(member)
            digest = hashlib.sha256(raw).hexdigest()
            if digest != meta["sha256_raw"]:
                print(f"FAIL {key}: sha {digest} != {meta['sha256_raw']}", file=sys.stderr)
                return 1
            if len(raw) != meta["bytes_raw"]:
                print(f"FAIL {key}: size", file=sys.stderr)
                return 1
            out = LEGACY / meta["canonical_gz"]
            out.write_bytes(gzip.compress(raw, mtime=0))
            written.append({"key": key, "path": str(out), "sha256": digest})
    missing = set(items) - {w["key"] for w in written}
    if missing:
        print(f"FAIL missing keys from ZIP: {sorted(missing)}", file=sys.stderr)
        return 1
    print(json.dumps({"status": "IMPORTED", "count": len(written), "items": written}, ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
