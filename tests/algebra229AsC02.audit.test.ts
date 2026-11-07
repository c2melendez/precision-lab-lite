"""Algebra229 AS-C-02 simplify (x^3-1)/(x^2-1): frozen row, exact result, excluded points."""
import gzip
from fractions import Fraction
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app

SOURCE_GZ = Path(__file__).resolve().parents[2] / "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz"
INPUT = "(x^3-1)/(x^2-1)"
EXPECTED = "(x^2+x+1)/(x+1)"
SAMPLES = (-3, -2, 0, 2, 3, 5)


def _compact(text: str) -> str:
    return "".join(text.split())


def _simplify(expression: str) -> dict:
    with TestClient(app) as client:
        response = client.post("/api/v1/simplify", json={"expression": expression})
    assert response.status_code == 200, response.text
    result = response.json()
    assert result["success"] is True, result
    assert result["operation"] == "simplify", result
    assert result["request_id"], result
    return result


def _evaluate(expression: str) -> dict:
    with TestClient(app) as client:
        response = client.post("/api/v1/evaluate", json={"expression": expression})
    assert response.status_code == 200, response.text
    return response.json()


def test_as_c02_source_row_matches_all_frozen_contract_cells():
    text = gzip.decompress(SOURCE_GZ.read_bytes()).decode("utf-8")
    source_row = next(line.strip() for line in text.splitlines() if line.startswith("| AS-C-02 |"))
    cells = [cell.strip() for cell in source_row.split("|")]
    assert len(cells) == 8, source_row
    assert cells[1:7] == [
        "AS-C-02",
        "N2",
        "`simplificar`",
        r"`\frac{x^{3}-1}{x^{2}-1}`",
        r"`\frac{x^{2} + x + 1}{x + 1}`",
        "",
    ], source_row
    assert cells[7] == "", source_row


def test_as_c02_simplify_endpoint_returns_exact_result():
    result = _simplify(INPUT)
    assert _compact(result["result_text"]) == _compact(EXPECTED), result


def test_as_c02_independent_arithmetic_matches_every_sample_outside_roots():
    for value in SAMPLES:
        expected = Fraction(value**3 - 1, value**2 - 1)
        assert expected == Fraction(value**2 + value + 1, value + 1)
        result = _evaluate(f"(x^3-1)/(x^2-1) con x={value}")
        assert result["success"] is True, result
        assert Fraction(_compact(result["result_text"])) == expected, (value, result)


def test_as_c02_excluded_points_are_not_claimed_as_equivalent():
    for value in (1, -1):
        result = _evaluate(f"(x^3-1)/(x^2-1) con x={value}")
        assert result["success"] is False, result
        assert result["error_code"] == "DOMAIN_ERROR", result
