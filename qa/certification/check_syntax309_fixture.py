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
    assert FULL.is_file(), "Full 309-case fixture is required for certification integrity"
    full = load(FULL)
    assert len(full) == 309
    assert collections.Counter(c["nivel"] for c in full) == {"N1": 104, "N2": 183, "N3": 22}
    expected_sections = {"P": 33, "F": 48, "E": 31, "N": 31, "D": 14, "U": 25,
                         "V": 28, "Q": 23, "M": 20, "S": 20, "R": 14, "X": 22}
    assert collections.Counter(c["seccion"] for c in full) == expected_sections
    assert [c for c in full if c["seccion"] == "P"] == part
    print("Syntax309 FULL integrity PASS: 309 unique IDs, official levels and sections, SY-P 33")


if __name__ == "__main__":
    main()
