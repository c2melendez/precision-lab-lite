"""Dispatch-integrity regressions for the canonical Certification Runner.

These tests are static. They read the workflow, the continuity index and the
gate workflows; they never call GitHub, never dispatch a workflow and never
declare certification. Their purpose is to lock the decisions that keep the
Runner from duplicating a gate, from dispatching on push or dry-run, from
losing the request-to-run correlation, and from publishing over a branch that
moved while the gate was running.

They intentionally complement ``test_runner_contract.py`` (Bridge input
contract) and ``test_runner_policy.py`` (commit/path policy).
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = ROOT / ".github" / "workflows" / "certification-runner.yml"
CONTINUITY = ROOT / "qa" / "certification" / "continuity.json"

STEP_PATTERN = r"(?ms)^      - name: {name}\n(?P<body>.*?)(?=^      - name:|\Z)"


def step(workflow: str, name: str) -> str:
    match = re.search(STEP_PATTERN.format(name=re.escape(name)), workflow)
    if match is None:
        raise AssertionError(f"step not found in runner workflow: {name}")
    return match.group("body")


def step_index(workflow: str, name: str) -> int:
    marker = f"      - name: {name}\n"
    index = workflow.find(marker)
    if index < 0:
        raise AssertionError(f"step not found in runner workflow: {name}")
    return index


def choice_options(workflow: str, field: str) -> list[str]:
    match = re.search(
        rf"(?ms)^      {re.escape(field)}:\n(?P<body>.*?)(?=^      \S|\Z)",
        workflow,
    )
    if match is None:
        raise AssertionError(f"workflow_dispatch input not found: {field}")
    options = re.search(r"(?m)^        options: \[(?P<items>[^\]]+)\]", match.group("body"))
    if options is None:
        raise AssertionError(f"input {field} does not declare choices")
    return [item.strip() for item in options.group("items").split(",")]


def workflow_dispatch_block(text: str) -> str:
    start = text.find("\n  workflow_dispatch:")
    if start < 0:
        raise AssertionError("workflow does not accept workflow_dispatch")
    rest = text[start + 1:]
    end = re.search(r"(?m)^\S", rest)
    return rest[: end.start()] if end else rest


class RunnerDispatchIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workflow = WORKFLOW.read_text(encoding="utf-8")
        cls.continuity = json.loads(CONTINUITY.read_text(encoding="utf-8"))

    def test_dispatch_requires_dispatch_event_non_dry_run_and_no_existing_run(self):
        dispatch = step(self.workflow, "Dispatch gate workflow and wait for its result")
        self.assertIn("github.event_name == 'workflow_dispatch'", dispatch)
        self.assertIn("inputs.dry_run != true", dispatch)
        self.assertIn("env.RUN_ID == ''", dispatch)
        self.assertIn("gh workflow run", dispatch)

    def test_equivalent_run_probe_precedes_dispatch(self):
        probe = step(self.workflow, "Detect an equivalent active gate run before dispatch")
        self.assertLess(
            step_index(self.workflow, "Detect an equivalent active gate run before dispatch"),
            step_index(self.workflow, "Dispatch gate workflow and wait for its result"),
        )
        self.assertIn('.headSha == \\"$BASE_SHA\\"', probe)
        for status in ("queued", "in_progress", "waiting"):
            self.assertIn(f'.status == \\"{status}\\"', probe)
        self.assertIn('--branch "$CANONICAL_BRANCH"', probe)
        self.assertIn('--workflow "$WF_FILE"', probe)

    def test_existing_run_is_waited_not_redispatched(self):
        probe = step(self.workflow, "Detect an equivalent active gate run before dispatch")
        self.assertIn('echo "RUN_ID=$EXISTING_RUN_ID"', probe)
        self.assertIn('echo "DECISION=WAIT_EXISTING"', probe)

        wait = step(self.workflow, "Wait for the equivalent active gate run")
        self.assertIn("env.DECISION == 'WAIT_EXISTING'", wait)
        self.assertIn('gh run view "$RUN_ID"', wait)
        self.assertIn("DISPATCHED_STATUS=", wait)
        self.assertIn("DISPATCHED_CONCLUSION=", wait)

        dispatch = step(self.workflow, "Dispatch gate workflow and wait for its result")
        self.assertIn("env.RUN_ID == ''", dispatch)

    def test_dispatch_resolves_the_gate_workflow_before_running_it(self):
        policy = step(self.workflow, "Gate policy and workflow resolution")
        self.assertIn('if gate not in gates', policy)
        self.assertIn("GATE_WORKFLOW=", policy)
        dispatch = step(self.workflow, "Dispatch gate workflow and wait for its result")
        self.assertIn('WF_FILE="$(basename "$GATE_WORKFLOW")"', dispatch)
        self.assertIn('-f reason="$REASON"', dispatch)
        self.assertIn("gate=${GATE}", dispatch)
        self.assertIn("sha=${BASE_SHA}", dispatch)

    def test_record_captures_the_full_correlation_chain(self):
        record = step(self.workflow, "Record result in QA (dispatch runs only)")
        for field in (
            "base_sha",
            "canonical_branch",
            "gate",
            "gate_workflow",
            "decision",
            "runner_run_id",
            "runner_run_url",
            "dispatched_run_id",
            "dispatched_run_url",
            "dispatched_status",
            "dispatched_conclusion",
        ):
            with self.subTest(field=field):
                self.assertIn(f'"{field}"', record)
        self.assertIn("always()", record)

    def test_record_is_persisted_and_published_in_order(self):
        record = step_index(self.workflow, "Record result in QA (dispatch runs only)")
        persist = step_index(self.workflow, "Persist execution observation in continuity records")
        commit = step_index(
            self.workflow,
            "Commit runner and documentary records (paths-ignore prevents record-only loops)",
        )
        self.assertLess(record, persist)
        self.assertLess(persist, commit)

        publish = step(
            self.workflow,
            "Commit runner and documentary records (paths-ignore prevents record-only loops)",
        )
        self.assertIn("record_runner_execution.py", self.workflow[persist:commit])
        self.assertIn('git fetch origin "$CANONICAL_BRANCH"', publish)
        self.assertIn('"origin/$CANONICAL_BRANCH"', publish)
        self.assertIn('"$BASE_SHA"', publish)
        self.assertLess(publish.index('"origin/$CANONICAL_BRANCH"'), publish.index('git push'))
        self.assertIn('git push origin "HEAD:$CANONICAL_BRANCH"', publish)

    def test_push_and_dry_run_cannot_reach_dispatch_or_record(self):
        dispatch = step(self.workflow, "Dispatch gate workflow and wait for its result")
        self.assertIn("github.event_name == 'workflow_dispatch'", dispatch)
        self.assertIn("inputs.dry_run != true", dispatch)

        record = step(self.workflow, "Record result in QA (dispatch runs only)")
        self.assertIn("github.event_name == 'workflow_dispatch'", record)
        self.assertIn("inputs.dry_run != true", record)

        push_summary = step(self.workflow, "Push summary")
        self.assertNotIn("gh workflow run", push_summary)

    def test_job_guard_restricts_target_repo_to_this_repository(self):
        self.assertIn(
            "endsWith(github.repository, format('-{0}', inputs.target_repo))",
            self.workflow,
        )
        self.assertIn("inputs.target_repo == 'both'", self.workflow)

    def test_dispatchable_gates_are_declared_in_continuity(self):
        declared = set(self.continuity["gates"])
        exposed = set(choice_options(self.workflow, "gate"))
        self.assertTrue(exposed, "runner must expose at least one gate")
        self.assertLessEqual(exposed, declared)

    def test_every_dispatchable_gate_workflow_exists_and_requires_reason(self):
        gates = self.continuity["gates"]
        for gate in choice_options(self.workflow, "gate"):
            with self.subTest(gate=gate):
                path = ROOT / gates[gate]["workflow"]
                self.assertTrue(path.is_file(), f"missing gate workflow: {path}")
                text = path.read_text(encoding="utf-8")
                block = workflow_dispatch_block(text)
                reason = block.find("reason:")
                self.assertGreaterEqual(reason, 0, f"{path} must accept a reason input")
                self.assertIn("required: true", block[reason:])

    def test_plus_security_gate_stays_blocked(self):
        policy = step(self.workflow, "Gate policy and workflow resolution")
        self.assertIn('gate == "security" and repo.endswith("-plus")', policy)
        self.assertIn("No se despacha nada", policy)


if __name__ == "__main__":
    unittest.main()
