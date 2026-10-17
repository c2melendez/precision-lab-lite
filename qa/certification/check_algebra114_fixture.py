#!/usr/bin/env python3
"""Read-only structural validator of original Algebra114 Markdown matrix."""
from collections import Counter
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "algebra114_source.md"
EXPECTED = {"SIM": 10, "EXP": 10, "FAC": 12, "PF": 8, "RAT": 10,
            "DIV": 8, "PAR": 10, "AVS": 10, "RAD": 10, "DOM": 6,
            "MUL": 6, "CONV": 8, "LIM": 6}
ROW = re.compile(r"^\|\s*(AS-([A-Z]+)-(\d{2}))\s*\|\s*(N[123])\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*$")

def validate() -> None:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    candidates = [s for s in lines if re.match(r"^\|\s*AS-", s)]
    rows = []
    for line in candidates:
        match = ROW.fullmatch(line)
        if match is None:
            raise AssertionError(f"Malformed original Algebra114 row: {line!r}")
        case_id, group, index, level, expression, oracle = match.groups()
        assert expression and oracle, f"Missing expression/oracle for {case_id}"
        rows.append((case_id, group, int(index), level))
    assert len(rows) == 114, f"Expected 114 rows, found {len(rows)}"
    assert len(set(r[0] for r in rows)) == 114, "Duplicate case identifiers"
    counts = Counter(group for _, group, _, _ in rows)
    assert counts == EXPECTED, f"Unexpected section counts: {counts}"
    for section, count in EXPECTED.items():
        numbers = sorted(number for _, group, number, _ in rows if group == section)
        assert numbers == list(range(1, count + 1)), f"Sequence gap in {section}: {numbers}"
    assert rows[0][0] == "AS-SIM-01" and rows[-1][0] == "AS-LIM-06"
    print("Algebra114 fixture OK: 114 original rows / 114 unique IDs / 13 complete groups")

if __name__ == "__main__":
    validate()
