#!/usr/bin/env python3
"""Regresiones del Certification Runner v4 (Lite/Plus) y del planner de continuidad.

Cubre los criterios de aceptación del handoff:
- Hallazgo A: registros generados NO alteran la huella técnica; cada categoría de
  input técnico SÍ la altera.
- Hallazgo B: ningún commit generado por el runner usa [skip ci]; no hay strings
  "skip ci" operativos fuera de los comentarios de política.
- operation=code existe con validaciones estrictas, idempotencia por change_key y
  merge condicionado a checks verdes en el HEAD final exacto.
- Anti-duplicación de gates: REUSE/WAIT/DISPATCH antes de despachar.
Sintaxis: YAML parseable, bash -n en cada bloque run, ast.parse en cada heredoc PY.
"""
import ast
import re
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
RUNNER_V4 = ROOT / "work" / "runner-v4-lite.yml"
CONTINUITY = ROOT / "fix" / "continuity.py"

sys.path.insert(0, str(CONTINUITY.parent))
import continuity  # noqa: E402


def load_workflow():
    return yaml.safe_load(RUNNER_V4.read_text(encoding="utf-8"))


def steps(wf=None):
    wf = wf or load_workflow()
    return wf["jobs"]["certification-cycle"]["steps"]


# ------------------------------------------------------------------ sintaxis --

def test_yaml_valid_and_operations():
    wf = load_workflow()
    opts = wf[True]["workflow_dispatch"]["inputs"]["operation"]["options"]
    assert opts == ["gate", "docs", "code"], opts
    assert len(steps()) >= 24


def test_bash_syntax_all_run_blocks():
    for s in steps():
        if "run" not in s:
            continue
        p = subprocess.run(["bash", "-n"], input=s["run"], text=True, capture_output=True)
        assert p.returncode == 0, f"{s['name']}: {p.stderr}"


def test_python_heredocs_compile():
    found = 0
    for s in steps():
        if "run" not in s:
            continue
        for m in re.finditer(r"<<'?PY'?\n(.*?)\n\s*PY\n", s["run"], re.S):
            found += 1
            block = m.group(1)
            lines = block.split("\n")
            indent = min(len(l) - len(l.lstrip()) for l in lines if l.strip())
            code = "\n".join(l[indent:] if l.strip() else "" for l in lines)
            try:
                ast.parse(code)
            except SyntaxError as e:
                raise AssertionError(f"{s['name']}: {e}") from e
    assert found >= 6, found


# ------------------------------------------------------- Hallazgo B: skip ci --

def test_no_skip_ci_in_generated_commit_messages():
    offenders = []
    for s in steps():
        if "run" not in s:
            continue
        for line in s["run"].splitlines():
            stripped = line.strip()
            if stripped.startswith("#"):
                continue
            if "git commit -m" in stripped and ("[skip ci]" in stripped or "[ci skip]" in stripped):
                offenders.append((s["name"], stripped))
    assert not offenders, offenders


def test_code_op_rejects_skip_ci_subjects():
    text = RUNNER_V4.read_text(encoding="utf-8")
    assert "prohibido en v4 (Hallazgo B)" in text
    step = next(s for s in steps() if s["name"].startswith("Apply code package"))
    assert "[skip ci]" in step["run"] and "[ci skip]" in step["run"]


# -------------------------------------------------------- Hallazgo A: huella --

GATE = {"workflow": "in625-cumulative-certification.yml",
        "inputs": ["scripts/**", "src/**", ".github/workflows/**",
                   "qa/certification/fixtures/**", "package.json",
                   "qa/certification/*.md"]}
PROSE = set()

BASE_ENTRIES = {
    "scripts/certification/continuity.py": ["100644", "blob", "aaa"],
    "src/engine.ts": ["100644", "blob", "bbb"],
    ".github/workflows/in625-cumulative-certification.yml": ["100644", "blob", "ccc"],
    "qa/certification/SY_P_23_CONVENTION.md": ["100644", "blob", "ddd"],
    "package.json": ["100644", "blob", "eee"],
}


def fp(entries):
    return continuity.fingerprint(entries, GATE, PROSE)


def test_runner_record_does_not_change_fingerprint():
    with_record = dict(BASE_ENTRIES)
    with_record["qa/certification/runner/40352572002.json"] = ["100644", "blob", "new"]
    changed = dict(with_record)
    changed["qa/certification/runner/40352572002.json"] = ["100644", "blob", "other"]
    assert fp(BASE_ENTRIES) == fp(with_record) == fp(changed)


def test_technical_inputs_still_count():
    for path, mode in [
        ("scripts/certification/continuity.py", "100644"),
        ("src/engine.ts", "100644"),
        (".github/workflows/in625-cumulative-certification.yml", "100644"),
        ("package.json", "100644"),
        ("qa/certification/SY_P_23_CONVENTION.md", "100644"),
    ]:
        mutated = dict(BASE_ENTRIES)
        mutated[path] = [mode, "blob", "CHANGED"]
        assert fp(mutated) != fp(BASE_ENTRIES), path


def test_whole_qa_certification_not_excluded():
    entries = dict(BASE_ENTRIES)
    entries["qa/certification/fixtures/algebra229.json"] = ["100644", "blob", "fff"]
    before = fp(entries)
    entries["qa/certification/fixtures/algebra229.json"] = ["100644", "blob", "ggg"]
    assert fp(entries) != before
    entries2 = dict(BASE_ENTRIES)
    entries2["qa/certification/README.md"] = ["100644", "blob", "hhh"]
    b2 = fp(entries2)
    entries2["qa/certification/README.md"] = ["100644", "blob", "iii"]
    assert fp(entries2) != b2


def test_record_prefix_is_exact():
    assert continuity.is_runner_record("qa/certification/runner/1.json")
    assert not continuity.is_runner_record("qa/certification/runner-notes.md")
    assert not continuity.is_runner_record("docs/qa/certification/runner/1.json")
    assert not continuity.is_runner_record("qa/certification/SY_P_23_CONVENTION.md")


# ------------------------------------------------------------ operación code --

def test_code_inputs_declared():
    inputs = load_workflow()[True]["workflow_dispatch"]["inputs"]
    for k in ("code_change_key", "code_patch_url", "code_patch_sha256",
              "code_expected_base_sha", "code_allow_technical", "code_merge_after_green"):
        assert k in inputs, k


def test_code_steps_present_with_guards():
    names = [s.get("name") for s in steps()]
    for expected in ("Code request validation",
                     "Download and verify code package",
                     "Apply code package on work branch with scope enforcement",
                     "Push work branch idempotently and ensure single PR per change_key",
                     "Merge after all required checks green on final head (opt-in)"):
        assert expected in names, names
    push_step = next(s for s in steps() if s["name"].startswith("Push work branch"))
    assert "--force-with-lease" in push_step["run"]
    assert "gh pr list" in push_step["run"] and "gh pr create" in push_step["run"]
    merge_step = next(s for s in steps() if s["name"].startswith("Merge after"))
    assert "code_merge_after_green == true" in merge_step["if"]
    assert "$HEAD_NOW\" != \"$FINAL_HEAD" in merge_step["run"]


def test_code_allowlist_protects_forbidden_paths():
    apply_step = next(s for s in steps() if s["name"].startswith("Apply code package"))
    body = apply_step["run"]
    for protected in (".github/workflows/", "tests/", "e2e/",
                      "qa/certification/runner/", "package-lock.json"):
        assert protected in body, protected
    assert "code_allow_technical=true" in body


# ---------------------------------------------------- anti-duplicación gate ---

def test_gate_anti_duplication_before_dispatch():
    st = steps()
    idx_anti = next(i for i, s in enumerate(st) if s["name"].startswith("Gate anti-duplication"))
    idx_dispatch = next(i for i, s in enumerate(st) if s["name"].startswith("Dispatch gate workflow"))
    assert idx_anti < idx_dispatch
    dispatch = st[idx_dispatch]
    assert "env.EVIDENCE_DECISION == 'DISPATCH'" in dispatch["if"]
    anti = st[idx_anti]["run"]
    assert "REUSED" in anti and "WAIT" in anti and "headSha == " in anti


def test_records_are_planner_outputs():
    record_step = next(s for s in steps() if s["name"].startswith("Record result in QA"))
    assert "EVIDENCE_DECISION" in record_step["run"]
    assert "decision\": decision" in record_step["run"]


ALL_TESTS = sorted(k for k in list(globals()) if k.startswith("test_"))

if __name__ == "__main__":
    failed = 0
    for name in ALL_TESTS:
        try:
            globals()[name]()
            print(f"PASS {name}")
        except Exception as e:
            failed += 1
            print(f"FAIL {name}: {e}")
    print(f"\n{len(ALL_TESTS) - failed}/{len(ALL_TESTS)} pruebas aprobadas")
    sys.exit(1 if failed else 0)
