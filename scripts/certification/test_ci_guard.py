import copy
import importlib.util
import pathlib
import unittest
import os
import tempfile
from unittest import mock

spec = importlib.util.spec_from_file_location("ci_guard", pathlib.Path(__file__).with_name("ci_guard.py"))
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class EvidenceTests(unittest.TestCase):
    def setUp(self):
        self.required = {"backend": ["Regression"], "frontend": ["Build", "Tests"]}
        self.jobs = [{"name": name, "status": "completed", "conclusion": "success", "steps": [
            {"name": step, "status": "completed", "conclusion": "success"} for step in steps
        ]} for name, steps in self.required.items()]

    def test_real_completed_jobs_and_steps_are_accepted(self):
        self.assertTrue(guard.real_evidence(self.jobs, self.required))

    def test_successful_noop_run_is_not_evidence(self):
        self.jobs[0]["steps"][0]["conclusion"] = "skipped"
        self.assertFalse(guard.real_evidence(self.jobs, self.required))

    def test_missing_failed_skipped_running_and_duplicate_jobs_rejected(self):
        for conclusion in ("skipped", "failure", "cancelled", None):
            jobs = copy.deepcopy(self.jobs)
            jobs[0]["conclusion"] = conclusion
            self.assertFalse(guard.real_evidence(jobs, self.required))
        self.assertFalse(guard.real_evidence(self.jobs[:1], self.required))
        self.assertFalse(guard.real_evidence(self.jobs + [self.jobs[0]], self.required))
        self.jobs[0]["status"] = "in_progress"
        self.assertFalse(guard.real_evidence(self.jobs, self.required))

    def test_missing_running_and_duplicate_steps_rejected(self):
        jobs = copy.deepcopy(self.jobs)
        jobs[0]["steps"] = []
        self.assertFalse(guard.real_evidence(jobs, self.required))
        jobs = copy.deepcopy(self.jobs)
        jobs[0]["steps"][0]["status"] = "in_progress"
        self.assertFalse(guard.real_evidence(jobs, self.required))
        jobs = copy.deepcopy(self.jobs)
        jobs[0]["steps"] *= 2
        self.assertFalse(guard.real_evidence(jobs, self.required))

    def test_only_same_sha_noncurrent_completed_real_run_is_reused(self):
        test = self
        class API:
            def get(self, path):
                test.assertIn("head_sha=abc", path)
                return {"workflow_runs": [
                    {"id": 1, "head_sha": "abc", "event": "push", "status": "completed", "conclusion": "success", "run_attempt": 1},
                    {"id": 2, "head_sha": "other", "event": "push", "status": "completed", "conclusion": "success", "run_attempt": 1},
                    {"id": 3, "head_sha": "abc", "event": "pull_request", "status": "completed", "conclusion": "success", "run_attempt": 1},
                    {"id": 4, "head_sha": "abc", "event": "push", "status": "completed", "conclusion": "success", "run_attempt": 2},
                ]}
            def jobs(self, run_id, attempt):
                test.assertEqual((run_id, attempt), (4, 2))
                return test.jobs
        self.assertEqual(guard.find_evidence(API(), "gate.yml", "abc", "1", self.required), 4)

    def test_noop_not_transitively_accepted_but_prior_real_run_is(self):
        test = self
        class API:
            def get(self, path):
                return {"workflow_runs": [dict(id=i, head_sha="abc", event="push", status="completed", conclusion="success", run_attempt=1) for i in (5, 4)]}
            def jobs(self, run_id, attempt):
                jobs = copy.deepcopy(test.jobs)
                if run_id == 5:
                    jobs[0]["steps"][0]["conclusion"] = "skipped"
                return jobs
        self.assertEqual(guard.find_evidence(API(), "gate.yml", "abc", "6", self.required), 4)

    def test_api_failure_is_not_misclassified_as_evidence(self):
        class API:
            def get(self, path):
                raise OSError("unavailable")
        with self.assertRaises(OSError):
            guard.find_evidence(API(), "gate.yml", "abc", "6", self.required)

    def test_jobs_pagination_not_partial(self):
        api = guard.GitHub("owner/repo", "token")
        api.get = lambda path: {"jobs": [self.jobs[0]], "total_count": 1001}
        with self.assertRaises(ValueError):
            api.jobs(1, 1)


    def test_main_api_failure_runs_gate_and_writes_false(self):
        with tempfile.TemporaryDirectory() as directory:
            output = pathlib.Path(directory) / "output"
            env = {"GITHUB_OUTPUT": str(output), "GITHUB_TOKEN": "token",
                   "GITHUB_WORKFLOW_REF": "owner/repo/.github/workflows/gate.yml@refs/heads/qa",
                   "GITHUB_REPOSITORY": "owner/repo", "GITHUB_RUN_ID": "7", "GITHUB_EVENT_NAME": "push"}
            with mock.patch.dict(os.environ, env, clear=True), mock.patch.object(guard.subprocess, "check_output", return_value="a" * 40), mock.patch("sys.argv", ["guard", "--profile", "h1d"]), mock.patch.object(guard, "find_evidence", side_effect=OSError("network")):
                guard.main()
            self.assertIn("skip=false\n", output.read_text())

    def test_main_missing_credentials_runs_gate(self):
        with mock.patch.dict(os.environ, {}, clear=True), mock.patch.object(guard.subprocess, "check_output", return_value="a" * 40), mock.patch("sys.argv", ["guard", "--profile", "h1d"]), mock.patch.object(guard, "output") as emit:
            guard.main()
            self.assertIs(emit.call_args.args[0], False)

    def test_manual_dispatch_requires_reason_and_always_runs(self):
        env = {"GITHUB_EVENT_NAME": "workflow_dispatch", "REVALIDATION_REASON": ""}
        with mock.patch.dict(os.environ, env, clear=True), mock.patch.object(guard.subprocess, "check_output", return_value="a" * 40), mock.patch("sys.argv", ["guard", "--profile", "h1d"]), mock.patch.object(guard, "output") as emit, mock.patch.object(guard, "find_evidence") as find:
            with self.assertRaises(SystemExit):
                guard.main()
            os.environ["REVALIDATION_REASON"] = "Revalidate after environment change"
            guard.main()
            self.assertIs(emit.call_args.args[0], False)
            find.assert_not_called()


    def test_extra_skipped_failed_or_running_job_invalidates_evidence(self):
        for status, conclusion in (("completed", "skipped"), ("completed", "failure"), ("in_progress", None)):
            jobs = self.jobs + [{"name": "extra", "status": status, "conclusion": conclusion}]
            self.assertFalse(guard.real_evidence(jobs, self.required))

    def test_latest_failure_cancel_or_pending_prevents_reusing_old_green(self):
        test = self
        for status, conclusion in (("completed", "failure"), ("completed", "cancelled"), ("in_progress", None), ("queued", None)):
            class API:
                def get(self, path):
                    test.assertNotIn("status=success", path)
                    # Deliberately unsorted API response.
                    return {"workflow_runs": [
                        dict(id=4, head_sha="abc", event="push", status="completed", conclusion="success", run_attempt=1, created_at="2026-10-16T01:00:00Z"),
                        dict(id=5, head_sha="abc", event="push", status=status, conclusion=conclusion, run_attempt=1, created_at="2026-10-16T02:00:00Z"),
                    ]}
                def jobs(self, *args):
                    test.fail("Older green must not be considered")
            self.assertIsNone(guard.find_evidence(API(), "gate.yml", "abc", "6", self.required))

    def test_noop_cannot_hide_an_intermediate_failure(self):
        test = self
        class API:
            def get(self, path):
                return {"workflow_runs": [
                    dict(id=4, head_sha="abc", event="push", status="completed", conclusion="success", run_attempt=1, created_at="2026-10-16T01:00:00Z"),
                    dict(id=5, head_sha="abc", event="push", status="completed", conclusion="failure", run_attempt=1, created_at="2026-10-16T02:00:00Z"),
                    dict(id=6, head_sha="abc", event="push", status="completed", conclusion="success", run_attempt=1, created_at="2026-10-16T03:00:00Z"),
                ]}
            def jobs(self, run_id, attempt):
                test.assertEqual(run_id, 6)
                jobs = copy.deepcopy(test.jobs)
                jobs[0]["steps"][0]["conclusion"] = "skipped"
                return jobs
        self.assertIsNone(guard.find_evidence(API(), "gate.yml", "abc", "7", self.required))

    def test_new_real_success_after_failure_is_valid(self):
        test = self
        class API:
            def get(self, path):
                return {"workflow_runs": [dict(id=i, head_sha="abc", event="push", status="completed", conclusion=conclusion, run_attempt=1, created_at=date) for i, conclusion, date in (
                    (4, "failure", "2026-10-16T01:00:00Z"), (5, "success", "2026-10-16T02:00:00Z"))]}
            def jobs(self, run_id, attempt):
                return test.jobs
        self.assertEqual(guard.find_evidence(API(), "gate.yml", "abc", "6", self.required), 5)

    def test_plus_native_requires_both_real_browser_steps(self):
        requirements = guard.PROFILES["plus-native"]
        jobs = [{"name": "syntax-native", "status": "completed", "conclusion": "success", "steps": [
            {"name": name, "status": "completed", "conclusion": "success"} for name in requirements["syntax-native"]]}]
        self.assertTrue(guard.real_evidence(jobs, requirements))
        jobs[0]["steps"][1]["conclusion"] = "skipped"
        self.assertFalse(guard.real_evidence(jobs, requirements))


if __name__ == "__main__":
    unittest.main()
