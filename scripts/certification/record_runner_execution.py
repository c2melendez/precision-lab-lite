#!/usr/bin/env python3
"""Persist factual certification-runner observations without declaring certification PASS.

This script is intentionally conservative:
- It records the runner and gate workflow outcomes as observations.
- It never advances continuity.json.next_action or closes blockers.
- A green workflow is not treated as accepted evidence until logs/required steps are reviewed.
"""
from __future__ import annotations

import datetime as dt
import json
import os
from pathlib import Path
import subprocess
import sys
from typing import Any


START = "<!-- certification-runner:latest:start -->"
END = "<!-- certification-runner:latest:end -->"


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")


def gh_gate_jobs(repo: str, run_id: str) -> tuple[list[dict[str, Any]], str | None]:
    if not run_id:
        return [], None
    try:
        result = subprocess.run(
            ["gh", "run", "view", run_id, "--repo", repo, "--json", "jobs"],
            check=True, capture_output=True, text=True,
        )
        payload = json.loads(result.stdout)
        jobs = [
            {
                "name": job.get("name", ""),
                "status": job.get("status", ""),
                "conclusion": job.get("conclusion", ""),
                "steps": [
                    {"name": step.get("name", ""), "status": step.get("status", ""),
                     "conclusion": step.get("conclusion", "")}
                    for step in job.get("steps", [])
                ],
            }
            for job in payload.get("jobs", [])
        ]
        return jobs, None
    except (subprocess.CalledProcessError, json.JSONDecodeError, OSError) as error:
        detail = getattr(error, "stderr", None) or str(error)
        return [], f"Could not retrieve gate jobs; review required: {detail[:500]}"


def classify(record: dict[str, Any], jobs: list[dict[str, Any]]) -> str:
    run_id = str(record.get("dispatched_run_id") or "")
    status = str(record.get("dispatched_status") or "")
    conclusion = str(record.get("dispatched_conclusion") or "")
    if not run_id:
        return "DISPATCH_NOT_CONFIRMED_REVIEW_REQUIRED"
    if status != "completed":
        return "RUN_INCOMPLETE_REVIEW_REQUIRED"
    if conclusion != "success":
        return "GATE_RUN_FAILED_DIAGNOSIS_REQUIRED"
    if not jobs or any(job.get("conclusion") != "success" for job in jobs):
        return "GATE_RUN_SUCCESS_WITH_JOB_EVIDENCE_GAP_REVIEW_REQUIRED"
    return "GATE_WORKFLOW_SUCCESS_LOG_AND_ACCEPTANCE_REVIEW_REQUIRED"


def render_latest(record: dict[str, Any], classification: str) -> str:
    repo = record.get("repo", "")
    gate = record.get("gate", "")
    runner_id = record.get("runner_run_id", "")
    gate_id = record.get("dispatched_run_id") or "none"
    base_sha = record.get("base_sha") or "unknown"
    status = record.get("dispatched_status") or "unknown"
    conclusion = record.get("dispatched_conclusion") or "unknown"
    recorded_at = record.get("recorded_at") or "unknown"
    return "\n".join([
        START,
        "## Última observación de certification-runner (registro automático)",
        "",
        f"- Registrado UTC: {recorded_at}",
        f"- Repositorio / gate: `{repo}` / `{gate}`",
        f"- SHA base del checkout probado: `{base_sha}`",
        f"- Runner: [`{runner_id}`](https://github.com/{repo}/actions/runs/{runner_id})",
        f"- Workflow de gate: [`{gate_id}`](https://github.com/{repo}/actions/runs/{gate_id})" if gate_id != "none" else "- Workflow de gate: no confirmado",
        f"- Estado/conclusión observados: `{status}` / `{conclusion}`",
        f"- Clasificación automática: `{classification}`",
        "- **No equivale a PASS de certificación.** Revisar jobs, pasos, logs, huella, canal, oráculo y revisión de aceptación antes de aceptar o reutilizar evidencia.",
        "- Este registro no modifica `next_action` ni cierra bloqueos; la siguiente tarea canónica sigue siendo la de `continuity.json` hasta una reconciliación explícita.",
        END,
    ])


def replace_latest_section(text: str, section: str) -> str:
    if START in text and END in text:
        before, rest = text.split(START, 1)
        _, after = rest.split(END, 1)
        return before.rstrip() + "\n\n" + section + after
    lines = text.splitlines()
    insert_at = 1 if lines and lines[0].startswith("# ") else 0
    lines[insert_at:insert_at] = ["", *section.splitlines(), ""]
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: record_runner_execution.py qa/certification/runner/<run_id>.json", file=sys.stderr)
        return 2
    root = Path(".")
    record_path = Path(sys.argv[1])
    record = json.loads(record_path.read_text(encoding="utf-8"))
    repo = str(record["repo"])
    gate_run_id = str(record.get("dispatched_run_id") or "")
    jobs, jobs_error = gh_gate_jobs(repo, gate_run_id)
    classification = classify(record, jobs)
    record["gate_jobs"] = jobs
    if jobs_error:
        record["gate_jobs_error"] = jobs_error
    record["execution_classification"] = classification
    record["acceptance_reviewed"] = False
    record["certification_pass"] = False
    record["documentation_recorded_at"] = utc_now()
    record_path.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    state_path = root / "qa/certification/continuity.json"
    state = json.loads(state_path.read_text(encoding="utf-8"))
    observation = {
        "runner_run_id": record.get("runner_run_id"),
        "runner_run_url": record.get("runner_run_url"),
        "base_sha": record.get("base_sha"),
        "gate": record.get("gate"),
        "gate_workflow": record.get("gate_workflow"),
        "dispatched_run_id": record.get("dispatched_run_id"),
        "dispatched_run_url": record.get("dispatched_run_url"),
        "dispatched_status": record.get("dispatched_status"),
        "dispatched_conclusion": record.get("dispatched_conclusion"),
        "execution_classification": classification,
        "acceptance_reviewed": False,
        "certification_pass": False,
        "recorded_at": record["documentation_recorded_at"],
    }
    history = state.setdefault("runner_observations", [])
    history.append(observation)
    state["runner_observations"] = history[-50:]
    state["last_runner_execution"] = observation
    # Do not alter revision, blockers, technical baseline, or next_action:
    # those require reconciliation by the certification decision process.
    state_path.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    current_path = root / "qa/certification/CURRENT_STATE.md"
    current_text = current_path.read_text(encoding="utf-8")
    current_path.write_text(
        replace_latest_section(current_text, render_latest(record, classification)),
        encoding="utf-8",
    )

    log_path = root / "qa/certification/EXECUTION_LOG.md"
    log_entry = "\n".join([
        "",
        f"## {record['documentation_recorded_at']} — certification-runner observation",
        "",
        f"- Runner run: {record.get('runner_run_url', '')}",
        f"- Gate: `{record.get('gate', '')}`; base SHA: `{record.get('base_sha', '')}`.",
        f"- Gate run: {record.get('dispatched_run_url') or 'not confirmed'}; status: `{record.get('dispatched_status') or 'unknown'}`; conclusion: `{record.get('dispatched_conclusion') or 'unknown'}`.",
        f"- Classification: `{classification}`. Jobs/steps snapshot stored in `{record_path.as_posix()}`.",
        "- This is execution telemetry, not acceptance. Logs, required-step execution, fingerprint, channel, oracle and acceptance revision still require review.",
        "- No objective/blocker was closed and `continuity.json.next_action` was deliberately left unchanged.",
        "",
    ])
    with log_path.open("a", encoding="utf-8") as handle:
        handle.write(log_entry)
    print(f"Updated {record_path}, continuity.json, CURRENT_STATE.md and EXECUTION_LOG.md")
    print(f"Classification: {classification}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
