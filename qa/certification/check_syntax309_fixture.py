"""Schema and provenance gate for official Syntax 309 data; no mathematical evaluation."""
import collections
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
PART = BASE / "syntax309_sy_p_cases.jsonl"
FULL = BASE / "syntax309_cases.jsonl"


def load(path):
    cases = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    ids = [case["id"] for case in cases]
    assert len(ids) == len(set(ids)), "duplicate case ID"
    for case in cases:
        assert case["matriz"] == "SY"
        assert case["nivel"] in ("N1", "N2", "N3")
        assert case["seccion"] == case["id"].split("-")[1]
        assert all(key in case for key in ("operacion", "entrada", "esperado", "nota"))
    return cases


def main():
    part = load(PART)
    assert len(part) == 33
    assert [x["id"] for x in part] == [f"SY-P-{i:02d}" for i in range(1, 34)]
    if FULL.is_file():
        full = load(FULL)
        assert len(full) == 309
        assert collections.Counter(c["nivel"] for c in full) == {"N1": 104, "N2": 183, "N3": 22}
        assert [c for c in full if c["seccion"] == "P"] == part
        print("Syntax309 FULL integrity PASS: 309 IDs; SY-P 33")
    else:
        print("Syntax309 SY-P integrity PASS: 33 IDs. Full 309 fixture MISSING/BLOCKED; not certified.")


if __name__ == "__main__":
    main()
