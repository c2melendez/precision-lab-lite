"""Static contract regressions for the Bridge -> Certification Runner boundary.

These tests do not dispatch workflows or contact GitHub. They verify that the
canonical workflow accepts the exact inputs sent by Bridge and that dry-run
and push events cannot dispatch a mathematical gate.
"""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = ROOT / ".github" / "workflows" / "certification-runner.yml"
REPO_KIND = ROOT.name.rsplit("-", 1)[-1]


class RunnerBridgeContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workflow = WORKFLOW.read_text(encoding="utf-8")

    def test_bridge_target_repo_values_are_accepted(self):
        self.assertIn(REPO_KIND, {"lite", "plus"})
        block = re.search(
            r"(?ms)^      target_repo:\n(?P<body>.*?)(?=^      gate:)",
            self.workflow,
        )
        self.assertIsNotNone(block, "workflow_dispatch must declare target_repo")
        self.assertRegex(
            block.group("body"),
            rf"(?m)^        options: \[{REPO_KIND},\s*both\]\s*$",
        )
        self.assertIn("inputs.target_repo == 'both'", self.workflow)

    def test_bridge_input_contract_is_explicit(self):
        self.assertRegex(self.workflow, r"(?m)^  workflow_dispatch:\s*$")
        for field in ("target_repo", "gate", "dry_run"):
            with self.subTest(field=field):
                self.assertRegex(self.workflow, rf"(?m)^      {field}:\s*$")
        dry_run = re.search(
            r"(?ms)^      dry_run:\n(?P<body>.*?)(?=^  push:)",
            self.workflow,
        )
        self.assertIsNotNone(dry_run)
        self.assertIn("type: boolean", dry_run.group("body"))

    def test_dry_run_never_dispatches_a_gate(self):
        summary = re.search(
            r"(?ms)^      - name: Dry-run summary\n(?P<body>.*?)(?=^      - name:|\Z)",
            self.workflow,
        )
        dispatch = re.search(
            r"(?ms)^      - name: Dispatch gate workflow and wait for its result\n(?P<body>.*?)(?=^      - name:|\Z)",
            self.workflow,
        )
        self.assertIsNotNone(summary)
        self.assertIsNotNone(dispatch)
        self.assertIn("inputs.dry_run == true", summary.group("body"))
        self.assertIn("No se despachó ningún workflow", summary.group("body"))
        self.assertIn("inputs.dry_run != true", dispatch.group("body"))
        self.assertIn("gh workflow run", dispatch.group("body"))

    def test_push_event_cannot_dispatch_a_gate(self):
        dispatch = re.search(
            r"(?ms)^      - name: Dispatch gate workflow and wait for its result\n(?P<body>.*?)(?=^      - name:|\Z)",
            self.workflow,
        )
        self.assertIsNotNone(dispatch)
        self.assertIn("github.event_name == 'workflow_dispatch'", dispatch.group("body"))
        push_summary = re.search(
            r"(?ms)^      - name: Push summary\n(?P<body>.*?)(?=^      - name:|\Z)",
            self.workflow,
        )
        self.assertIsNotNone(push_summary)
        self.assertNotIn("gh workflow run", push_summary.group("body"))

    def test_canonical_branch_is_resolved_from_certification_readme(self):
        self.assertIn("qa/certification/README.md", self.workflow)
        self.assertIn("CANONICAL_BRANCH=$CANONICAL", self.workflow)
        self.assertIn("ref: ${{ env.CANONICAL_BRANCH }}", self.workflow)

    def test_plus_security_gate_remains_blocked(self):
        if REPO_KIND == "plus":
            self.assertIn('gate == "security" and repo.endswith("-plus")', self.workflow)
            self.assertIn("No se despacha nada", self.workflow)


if __name__ == "__main__":
    unittest.main()
