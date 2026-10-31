"""Static regressions for the integrated Runner v3.1 docs operation.

The docs operation publishes documentary commits prepared outside GitHub. These
tests never download a package, never push and never dispatch a workflow. They
verify that the integrated workflow keeps the documentary scope, the transport
allowlist, the SHA-256/size checks and the compare-and-swap publication, and
that the gate and docs operations cannot run each other's steps.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = ROOT / ".github" / "workflows" / "certification-runner.yml"

GATE_STEPS = (
    "Read-only planner fingerprint for selected gate",
    "Gate policy and workflow resolution",
    "Dry-run summary",
    "Detect an equivalent active gate run before dispatch",
    "Wait for the equivalent active gate run",
    "Dispatch gate workflow and wait for its result",
    "Record result in QA (dispatch runs only)",
    "Persist execution observation in continuity records",
    "Commit runner and documentary records (paths-ignore prevents record-only loops)",
)

DOCS_STEPS = (
    "Docs request validation",
    "Download and verify docs package",
    "Apply docs package and enforce documentary scope",
    "Docs dry-run summary",
    "Record docs publication and commit",
    "Publish docs package with compare-and-swap",
)


def step(workflow: str, name: str) -> str:
    pattern = rf"(?ms)^      - name: {re.escape(name)}\n(?P<body>.*?)(?=^      - name:|\Z)"
    match = re.search(pattern, workflow)
    if match is None:
        raise AssertionError(f"step not found: {name}")
    return match.group("body")


def choice_options(workflow: str, field: str) -> list[str]:
    match = re.search(
        rf"(?ms)^      {re.escape(field)}:\n(?P<body>.*?)(?=^      \S|\Z)",
        workflow,
    )
    if match is None:
        raise AssertionError(f"input not found: {field}")
    options = re.search(r"(?m)^        options: \[(?P<items>[^\]]+)\]", match.group("body"))
    if options is None:
        raise AssertionError(f"input without choices: {field}")
    return [item.strip() for item in options.group("items").split(",")]


class RunnerDocsOperationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workflow = WORKFLOW.read_text(encoding="utf-8")

    def test_workflow_exposes_gate_and_docs_operations(self):
        self.assertEqual(choice_options(self.workflow, "operation"), ["gate", "docs"])
        self.assertIn("inputs.operation == 'gate'", self.workflow)
        self.assertIn("inputs.operation == 'docs'", self.workflow)

    def test_docs_inputs_are_declared_as_strings(self):
        for field in (
            "docs_patch_url",
            "docs_patch_sha256",
            "docs_expected_base_sha",
            "docs_patch_hosts",
        ):
            with self.subTest(field=field):
                match = re.search(
                    rf"(?ms)^      {field}:\n(?P<body>.*?)(?=^      \S|\Z)", self.workflow
                )
                self.assertIsNotNone(match)
                self.assertIn("type: string", match.group("body"))

    def test_gate_steps_are_gated_on_operation_gate(self):
        for name in GATE_STEPS:
            with self.subTest(step=name):
                body = step(self.workflow, name)
                self.assertIn("inputs.operation == 'gate'", body)

    def test_docs_steps_are_gated_on_operation_docs(self):
        for name in DOCS_STEPS:
            with self.subTest(step=name):
                body = step(self.workflow, name)
                self.assertIn("inputs.operation == 'docs'", body)

    def test_docs_never_accepts_both_repositories(self):
        body = step(self.workflow, "Docs request validation")
        self.assertIn("No se admite 'both'", body)
        self.assertIn('expected_target = "plus" if repo.endswith("-plus")', body)
        self.assertIn("elif target != expected_target", body)

    def test_docs_transport_is_https_only_and_credential_free(self):
        body = step(self.workflow, "Docs request validation")
        self.assertIn('parsed.scheme != "https"', body)
        self.assertIn("parsed.username or parsed.password", body)
        self.assertIn("if port not in (None, 443):", body)

    def test_docs_rejects_private_hosts_and_enforces_allowlist(self):
        body = step(self.workflow, "Docs request validation")
        self.assertIn('host == "localhost" or host.endswith(".local")', body)
        self.assertIn("ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved", body)
        self.assertIn('"raw.githubusercontent.com"', body)
        self.assertIn("host not in default_hosts and host not in extra", body)

    def test_docs_download_verifies_sha256_size_and_binaries(self):
        body = step(self.workflow, "Download and verify docs package")
        self.assertIn('--proto \'=https\'', body)
        self.assertIn("--max-filesize 5242880", body)
        self.assertIn('sha256sum "$PATCH_PATH"', body)
        self.assertIn("SHA-256 no coincide", body)
        self.assertIn("^GIT binary patch", body)

    def test_docs_scope_is_documentary_only(self):
        body = step(self.workflow, "Apply docs package and enforce documentary scope")
        self.assertIn('allowed_exact = {"qa/certification/continuity.json"}', body)
        self.assertIn('path.startswith("qa/certification/") and path.endswith(".md")', body)
        self.assertIn('new_mode != "100644"', body)
        self.assertIn('"[skip ci]"', body)
        self.assertIn("commit vacío", body)

    def test_docs_publication_is_compare_and_swap(self):
        body = step(self.workflow, "Publish docs package with compare-and-swap")
        self.assertIn('--force-with-lease="refs/heads/${CANONICAL_BRANCH}:${BASE_SHA}"', body)
        self.assertIn('git ls-remote origin "refs/heads/${CANONICAL_BRANCH}"', body)
        self.assertIn("REMOTE_AFTER", body)

    def test_docs_record_uses_schema_2_and_operation_docs(self):
        body = step(self.workflow, "Record docs publication and commit")
        self.assertIn('"schema_version": 2', body)
        self.assertIn('"operation": "docs"', body)
        self.assertIn('"patch_head_sha"', body)
        self.assertIn('"commits"', body)

    def test_docs_dry_run_never_publishes(self):
        dry = step(self.workflow, "Docs dry-run summary")
        publish = step(self.workflow, "Publish docs package with compare-and-swap")
        self.assertIn("inputs.dry_run == true", dry)
        self.assertIn("inputs.dry_run != true", publish)
        self.assertNotIn("git push", dry)

    def test_push_event_cannot_run_docs(self):
        for name in DOCS_STEPS:
            with self.subTest(step=name):
                self.assertIn("github.event_name == 'workflow_dispatch'", step(self.workflow, name))


if __name__ == "__main__":
    unittest.main()
