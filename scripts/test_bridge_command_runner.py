from __future__ import annotations
import importlib.util
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("bridge_command_runner.py")
SPEC = importlib.util.spec_from_file_location("bridge_command_runner", MODULE_PATH)
assert SPEC and SPEC.loader
worker = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(worker)

class BridgeCommandRunnerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name).resolve()

    def tearDown(self):
        self.temp.cleanup()

    def test_create_replace_delete_with_git_blob_preconditions(self):
        worker.apply_operations(self.root, [
            {"action": "create", "path": "src/generated.txt", "content": "one"},
        ])
        target = self.root / "src/generated.txt"
        self.assertEqual(target.read_text(encoding="utf-8"), "one")
        expected = worker.git_blob_sha(target.read_bytes())
        worker.apply_operations(self.root, [
            {"action": "replace", "path": "src/generated.txt", "content": "two",
             "expected_blob_sha": expected},
        ])
        self.assertEqual(target.read_text(encoding="utf-8"), "two")
        expected = worker.git_blob_sha(target.read_bytes())
        worker.apply_operations(self.root, [
            {"action": "delete", "path": "src/generated.txt", "expected_blob_sha": expected},
        ])
        self.assertFalse(target.exists())

    def test_stale_blob_sha_rejects_without_overwrite(self):
        target = self.root / "existing.txt"
        target.write_text("updated elsewhere", encoding="utf-8")
        with self.assertRaises(worker.RunnerFailure) as raised:
            worker.apply_operations(self.root, [
                {"action": "replace", "path": "existing.txt", "content": "overwrite",
                 "expected_blob_sha": "a" * 40},
            ])
        self.assertEqual(raised.exception.code, "STALE_EXPECTED_BLOB_SHA")
        self.assertEqual(target.read_text(encoding="utf-8"), "updated elsewhere")

    def test_rejects_traversal_absolute_windows_and_protected_paths(self):
        for path in (
            "../escape.txt", "/etc/passwd", r"..\escape.txt", r"C:\temp\evil.txt",
            ".env", ".env.production", ".github/workflows/evil.yml",
            ".git/config", "secrets/token.txt", "keys/private.pem", "folder/../escape.txt",
        ):
            with self.subTest(path=path):
                with self.assertRaises(worker.RunnerFailure):
                    worker.validate_repository_path(path)

    def test_rejects_duplicate_paths_case_insensitively(self):
        with self.assertRaises(worker.RunnerFailure) as raised:
            worker.validate_operations([
                {"action": "create", "path": "src/File.txt", "content": "a"},
                {"action": "create", "path": "src/file.txt", "content": "b"},
            ])
        self.assertEqual(raised.exception.code, "PATCH_DUPLICATE_PATH")

    def test_rejects_symlink_traversal(self):
        outside = self.root.parent / (self.root.name + "-outside.txt")
        outside.write_text("outside", encoding="utf-8")
        (self.root / "linked").symlink_to(outside)
        try:
            with self.assertRaises(worker.RunnerFailure) as raised:
                worker.apply_operations(self.root, [
                    {"action": "create", "path": "linked/overwrite.txt", "content": "bad"},
                ])
            self.assertEqual(raised.exception.code, "PATCH_SYMLINK_REJECTED")
        finally:
            outside.unlink(missing_ok=True)

    def test_rejects_file_and_total_patch_size_limits(self):
        with self.assertRaises(worker.RunnerFailure) as raised:
            worker.validate_operations([
                {"action": "create", "path": "big.txt", "content": "x" * (64 * 1024 + 1)},
            ])
        self.assertEqual(raised.exception.code, "PATCH_FILE_TOO_LARGE")
        with self.assertRaises(worker.RunnerFailure) as raised:
            worker.validate_operations([
                {"action": "create", "path": "a.txt", "content": "x" * (50 * 1024)},
                {"action": "create", "path": "b.txt", "content": "x" * (50 * 1024)},
                {"action": "create", "path": "c.txt", "content": "x" * (50 * 1024)},
                {"action": "create", "path": "d.txt", "content": "x" * (50 * 1024)},
            ])
        self.assertEqual(raised.exception.code, "PATCH_TOO_LARGE")

    def test_recognizes_exactly_applied_patch_for_replay(self):
        (self.root / "already.txt").write_text("same", encoding="utf-8")
        self.assertTrue(worker.patch_already_applied(self.root, [
            {"action": "create", "path": "already.txt", "content": "same"},
        ]))
        self.assertFalse(worker.patch_already_applied(self.root, [
            {"action": "create", "path": "already.txt", "content": "different"},
        ]))

    def test_plus_unit_profile_validates_backend_and_frontend(self):
        from unittest.mock import patch

        with patch.object(worker, "run") as run_command:
            worker.run_profile("plus", self.root, "unit")

        commands = [call.args[0] for call in run_command.call_args_list]
        self.assertIn(["npm", "ci"], commands)
        self.assertIn(["python", "-m", "pytest", "-q", "--cov=app", "--cov-report=term-missing",
                       "--cov-fail-under=75", "--disable-warnings"], commands)
        self.assertIn(["npm", "test"], commands)
        self.assertEqual(len(commands), 4)

if __name__ == "__main__":
    unittest.main()
