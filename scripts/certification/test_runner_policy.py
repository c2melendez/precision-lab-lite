"""Regression tests for runner commit and path-filter policy.

These tests intentionally inspect the deployed-in-branch workflow text without
adding a YAML parser dependency. They protect against reintroducing skip-ci
markers and against broad path exclusions that suppress contract validation.
"""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
RUNNER = ROOT / ".github" / "workflows" / "certification-runner.yml"
CUMULATIVE = ROOT / ".github" / "workflows" / "in625-cumulative-certification.yml"


class RunnerPolicyTests(unittest.TestCase):
    def test_runner_result_commit_does_not_use_skip_ci_marker(self):
        workflow = RUNNER.read_text(encoding="utf-8")
        messages = re.findall(
            r'^\s*git commit -m "([^"]+)"\s*$', workflow, re.MULTILINE
        )
        self.assertTrue(messages, "runner must have a reviewed commit message")
        forbidden = re.compile(
            r"\[(?:skip ci|ci skip|no ci|skip actions|actions skip)\]"
            r"|(?m)^skip-checks\s*:\s*true\s*$",
            re.IGNORECASE,
        )
        for message in messages:
            with self.subTest(message=message):
                self.assertIsNone(forbidden.search(message))

    def test_runner_only_records_are_filtered_by_path_not_commit_subject(self):
        workflow = RUNNER.read_text(encoding="utf-8")
        block = re.search(
            r"(?m)^    paths-ignore:\n(?P<body>(?:      - .*\n)+)", workflow
        )
        self.assertIsNotNone(block, "runner push must use explicit path filtering")
        ignored = block.group("body")
        self.assertIn('"qa/certification/runner/**"', ignored)
        self.assertIn('"qa/certification/continuity.json"', ignored)
        self.assertNotIn('"qa/certification/**"', ignored)

    def test_contract_markdown_is_explicitly_reincluded_in_cumulative_gate(self):
        workflow = CUMULATIVE.read_text(encoding="utf-8")
        for contract in (
            "qa/certification/EXECUTION_PROTOCOL.md",
            "qa/certification/SG28_DISTRIBUTED_ACCEPTANCE.md",
            "qa/certification/SY_P_23_CONVENTION.md",
            "qa/certification/SY_X_04_LENGTH_CONTRACT.md",
            "qa/certification/SY_X_04_LENGTH_DECISION.md",
            "qa/certification/SG28_INTEGRATION_EXIT_CRITERIA.md",
        ):
            with self.subTest(contract=contract):
                self.assertIn(contract, workflow)


if __name__ == "__main__":
    unittest.main()
