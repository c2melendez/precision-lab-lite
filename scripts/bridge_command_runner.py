#!/usr/bin/env python3
"""OIDC-authenticated, typed Bridge command worker. No arbitrary shell is accepted."""
from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path, PurePosixPath
from typing import Any

BRIDGE_BASE_URL = os.environ.get("BRIDGE_BASE_URL", "https://precision-lab-bridge.onrender.com").rstrip("/")
OWNER = "c2melendez"
MAX_FILE_BYTES = 64 * 1024
MAX_PATCH_BYTES = 192 * 1024
MAX_OPERATIONS = 40
SAFE_UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", re.I)
SAFE_BRANCH = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._/-]{0,254}$")
SHA40 = re.compile(r"^[0-9a-f]{40}$")
PROFILES = {"unit", "lint", "typecheck", "build"}
REPOSITORIES = {
    "c2melendez/precision-lab-lite": "lite",
    "c2melendez/precision-lab-plus": "plus",
}


class RunnerFailure(Exception):
    def __init__(self, code: str, message: str, status: str = "failed") -> None:
        super().__init__(message)
        self.code = code
        self.status = status


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise urllib.error.HTTPError(req.full_url, code, "redirect rejected", headers, fp)


OPENER = urllib.request.build_opener(NoRedirect())


def json_bytes(value: dict[str, Any]) -> bytes:
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def oidc_token() -> str:
    url = os.environ.get("ACTIONS_ID_TOKEN_REQUEST_URL", "")
    request_token = os.environ.get("ACTIONS_ID_TOKEN_REQUEST_TOKEN", "")
    if not url or not request_token:
        raise RunnerFailure("OIDC_TOKEN_UNAVAILABLE", "GitHub OIDC is not available", "blocked")
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != "https" or parsed.hostname != "pipelines.actions.githubusercontent.com":
        raise RunnerFailure("OIDC_ENDPOINT_INVALID", "GitHub OIDC endpoint is not trusted", "blocked")
    query = dict(urllib.parse.parse_qsl(parsed.query, keep_blank_values=True))
    query["audience"] = "precision-lab-bridge"
    token_url = urllib.parse.urlunsplit(
        (parsed.scheme, parsed.netloc, parsed.path, urllib.parse.urlencode(query), "")
    )
    request = urllib.request.Request(
        token_url,
        headers={"Authorization": "Bearer " + request_token, "Accept": "application/json"},
        method="GET",
    )
    try:
        with OPENER.open(request, timeout=10) as response:
            raw = response.read(32 * 1024 + 1)
    except Exception:
        raise RunnerFailure("OIDC_TOKEN_UNAVAILABLE", "Could not obtain GitHub OIDC token", "blocked")
    if len(raw) > 32 * 1024:
        raise RunnerFailure("OIDC_TOKEN_INVALID", "GitHub OIDC response exceeded its limit", "blocked")
    try:
        value = json.loads(raw.decode("utf-8"))
        token = value["value"]
    except Exception:
        raise RunnerFailure("OIDC_TOKEN_INVALID", "GitHub OIDC response was invalid", "blocked")
    if not isinstance(token, str) or len(token) > 16_384:
        raise RunnerFailure("OIDC_TOKEN_INVALID", "GitHub OIDC token was invalid", "blocked")
    return token


def http_json(
    url: str,
    method: str = "GET",
    payload: dict[str, Any] | None = None,
    headers: dict[str, str] | None = None,
    bearer: str | None = None,
    maximum: int = 128 * 1024,
) -> tuple[int, Any]:
    if not url.startswith("https://"):
        raise RunnerFailure("HTTPS_REQUIRED", "Runner requests must use HTTPS", "blocked")
    body = json_bytes(payload) if payload is not None else None
    request_headers = {"Accept": "application/json"}
    if body is not None:
        request_headers["Content-Type"] = "application/json"
    if bearer:
        request_headers["Authorization"] = "Bearer " + bearer
    if headers:
        request_headers.update(headers)
    request = urllib.request.Request(url, data=body, headers=request_headers, method=method)
    try:
        with OPENER.open(request, timeout=25) as response:
            raw = response.read(maximum + 1)
            status = response.status
    except urllib.error.HTTPError as error:
        raw = error.read(16 * 1024)
        detail = ""
        try:
            detail = str(json.loads(raw.decode("utf-8")).get("error", ""))
        except Exception:
            pass
        code = detail if re.fullmatch(r"[A-Z0-9_]{3,100}", detail) else "UPSTREAM_HTTP_ERROR"
        raise RunnerFailure(code, "Runner request was rejected with HTTP " + str(error.code), "blocked")
    except Exception:
        raise RunnerFailure("UPSTREAM_OUTCOME_UNKNOWN", "Runner request outcome is unknown", "reconcile_required")
    if len(raw) > maximum:
        raise RunnerFailure("UPSTREAM_RESPONSE_TOO_LARGE", "Runner response exceeded its limit", "blocked")
    if not raw:
        return status, {}
    try:
        return status, json.loads(raw.decode("utf-8"))
    except Exception:
        raise RunnerFailure("UPSTREAM_RESPONSE_INVALID", "Runner response was not valid JSON", "blocked")


def bridge_url(command_id: str, endpoint: str) -> str:
    host = urllib.parse.urlsplit(BRIDGE_BASE_URL).hostname
    if not BRIDGE_BASE_URL.startswith("https://") or host != "precision-lab-bridge.onrender.com":
        raise RunnerFailure("BRIDGE_ORIGIN_INVALID", "Bridge base URL is not trusted", "blocked")
    return BRIDGE_BASE_URL + "/api/internal/runner/commands/" + command_id + "/" + endpoint


def bridge_call(command_id: str, endpoint: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    status, result = http_json(
        bridge_url(command_id, endpoint),
        method="POST",
        payload=payload,
        bearer=oidc_token(),
        maximum=256 * 1024,
    )
    if status not in (200, 202) or not isinstance(result, dict):
        raise RunnerFailure("BRIDGE_REQUEST_FAILED", "Bridge rejected the runner request", "reconcile_required")
    return result


def run(command: list[str], cwd: Path, timeout: int = 1800) -> None:
    """Run a fixed executable/argument vector. Never invoke a shell."""
    try:
        subprocess.run(command, cwd=str(cwd), check=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        raise RunnerFailure("VALIDATION_TIMEOUT", "An allowlisted validation profile timed out")
    except subprocess.CalledProcessError as error:
        raise RunnerFailure("VALIDATION_FAILED", "An allowlisted validation exited with code " + str(error.returncode))


def git(*args: str, cwd: Path, timeout: int = 120, allow_failure: bool = False) -> str:
    try:
        result = subprocess.run(
            ["git", *args], cwd=str(cwd), check=not allow_failure,
            capture_output=True, text=True, timeout=timeout,
        )
    except subprocess.TimeoutExpired:
        raise RunnerFailure("GIT_OPERATION_TIMEOUT", "A Git operation timed out", "reconcile_required")
    except subprocess.CalledProcessError as error:
        if allow_failure:
            return ""
        message = (error.stderr or "").lower()
        status = "reconcile_required" if any(
            word in message for word in ("timeout", "connection", "could not resolve", "remote end hung up")
        ) else "failed"
        raise RunnerFailure("GIT_OPERATION_FAILED", "A Git operation failed", status)
    return result.stdout.strip()


def validate_repository_path(raw_path: str) -> str:
    if (
        not isinstance(raw_path, str) or not raw_path or len(raw_path) > 300
        or raw_path.startswith("/") or "\\" in raw_path or "\x00" in raw_path
        or any(ord(char) < 32 or ord(char) == 127 for char in raw_path)
        or re.match(r"^[A-Za-z]:", raw_path)
    ):
        raise RunnerFailure("PATCH_PATH_INVALID", "Patch path is invalid", "blocked")
    parts = raw_path.split("/")
    if any(not part or part in (".", "..") or part.endswith(".") or part.endswith(" ") for part in parts):
        raise RunnerFailure("PATCH_PATH_INVALID", "Patch path is invalid", "blocked")
    lower = raw_path.casefold()
    denied = (
        lower == ".git" or lower.startswith(".git/")
        or lower == ".github" or lower.startswith(".github/")
        or lower == ".env" or lower.startswith(".env.") or "/.env" in lower
        or lower == "secrets" or lower.startswith("secrets/") or "/secrets/" in lower
        or "credentials" in lower
        or lower.endswith((".pem", ".key", ".p12", ".pfx", ".tfstate"))
        or any(part.casefold() in ("id_rsa", "id_ed25519", "authorized_keys", ".npmrc", ".pypirc") for part in parts)
    )
    if denied:
        raise RunnerFailure("PATCH_PATH_PROTECTED", "Patch path is protected", "blocked")
    return "/".join(parts)


def git_blob_sha(content: bytes) -> str:
    header = b"blob " + str(len(content)).encode("ascii") + b"\0"
    return hashlib.sha1(header + content).hexdigest()


def safe_target(root: Path, relative: str) -> Path:
    parts = PurePosixPath(relative).parts
    current = root
    for part in parts:
        current = current / part
        if current.is_symlink():
            raise RunnerFailure("PATCH_SYMLINK_REJECTED", "Patch may not traverse symlinks", "blocked")
    candidate = root.joinpath(*parts)
    try:
        candidate.resolve(strict=False).relative_to(root.resolve())
    except ValueError:
        raise RunnerFailure("PATCH_PATH_INVALID", "Patch path escapes the checkout", "blocked")
    return candidate


def validate_operations(operations: Any) -> list[dict[str, Any]]:
    if not isinstance(operations, list) or not 1 <= len(operations) <= MAX_OPERATIONS:
        raise RunnerFailure("PATCH_SCHEMA_INVALID", "Patch operations are invalid", "blocked")
    seen: set[str] = set()
    total_bytes = 0
    validated: list[dict[str, Any]] = []
    for item in operations:
        if not isinstance(item, dict):
            raise RunnerFailure("PATCH_SCHEMA_INVALID", "Patch operation is invalid", "blocked")
        action = item.get("action")
        path = validate_repository_path(item.get("path"))
        if path.casefold() in seen:
            raise RunnerFailure("PATCH_DUPLICATE_PATH", "Patch paths must be unique", "blocked")
        seen.add(path.casefold())
        if action == "create":
            if set(item) != {"action", "path", "content"} or not isinstance(item["content"], str):
                raise RunnerFailure("PATCH_SCHEMA_INVALID", "Create operation is invalid", "blocked")
            content = item["content"].encode("utf-8", errors="strict")
        elif action == "replace":
            if set(item) != {"action", "path", "content", "expected_blob_sha"} or not isinstance(item["content"], str):
                raise RunnerFailure("PATCH_SCHEMA_INVALID", "Replace operation is invalid", "blocked")
            if not isinstance(item["expected_blob_sha"], str) or not SHA40.fullmatch(item["expected_blob_sha"]):
                raise RunnerFailure("PATCH_SCHEMA_INVALID", "Replace precondition is invalid", "blocked")
            content = item["content"].encode("utf-8", errors="strict")
        elif action == "delete":
            if set(item) != {"action", "path", "expected_blob_sha"}:
                raise RunnerFailure("PATCH_SCHEMA_INVALID", "Delete operation is invalid", "blocked")
            if not isinstance(item["expected_blob_sha"], str) or not SHA40.fullmatch(item["expected_blob_sha"]):
                raise RunnerFailure("PATCH_SCHEMA_INVALID", "Delete precondition is invalid", "blocked")
            content = b""
        else:
            raise RunnerFailure("PATCH_SCHEMA_INVALID", "Patch action is not allowlisted", "blocked")
        if len(content) > MAX_FILE_BYTES:
            raise RunnerFailure("PATCH_FILE_TOO_LARGE", "Patch file exceeds 64 KiB", "blocked")
        total_bytes += len(content)
        if total_bytes > MAX_PATCH_BYTES:
            raise RunnerFailure("PATCH_TOO_LARGE", "Combined patch exceeds 192 KiB", "blocked")
        validated.append({**item, "path": path, "_content_bytes": content})
    return validated


def apply_operations(root: Path, operations: Any) -> list[str]:
    validated = validate_operations(operations)
    touched: list[str] = []
    for item in validated:
        target = safe_target(root, item["path"])
        action = item["action"]
        if action == "create":
            if target.exists():
                raise RunnerFailure("PATCH_CREATE_CONFLICT", "Create target already exists", "blocked")
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open("xb") as stream:
                stream.write(item["_content_bytes"])
            os.chmod(target, 0o644)
        else:
            if not target.exists() or target.is_symlink() or not target.is_file():
                raise RunnerFailure("PATCH_TARGET_MISSING", "Replace/delete target is not a regular file", "blocked")
            if git_blob_sha(target.read_bytes()) != item["expected_blob_sha"]:
                raise RunnerFailure("STALE_EXPECTED_BLOB_SHA", "Patch file changed since it was read", "blocked")
            if action == "delete":
                target.unlink()
            else:
                descriptor, temporary = tempfile.mkstemp(prefix=".bridge-write-", dir=str(target.parent))
                try:
                    with os.fdopen(descriptor, "wb") as stream:
                        stream.write(item["_content_bytes"])
                    os.chmod(temporary, 0o644)
                    os.replace(temporary, target)
                finally:
                    if os.path.exists(temporary):
                        os.unlink(temporary)
        touched.append(item["path"])
    return touched


def patch_already_applied(root: Path, operations: Any) -> bool:
    for item in validate_operations(operations):
        target = safe_target(root, item["path"])
        if item["action"] == "delete":
            if target.exists():
                return False
        elif not target.is_file() or target.is_symlink() or target.read_bytes() != item["_content_bytes"]:
            return False
    return True


def prepare_dependencies(repo_kind: str, root: Path, profile: str) -> None:
    if repo_kind == "lite":
        if profile not in {"unit", "typecheck", "build"}:
            raise RunnerFailure("VALIDATION_PROFILE_UNSUPPORTED", "Validation profile is not supported by Lite", "blocked")
        run(["npm", "ci"], root, timeout=1200)
        return
    if repo_kind == "plus":
        if profile not in PROFILES:
            raise RunnerFailure("VALIDATION_PROFILE_UNSUPPORTED", "Validation profile is not supported by Plus", "blocked")
        run(
            ["python", "-m", "pip", "install", "-r", "requirements.txt", "-r", "requirements-qa.txt", "pytest-cov"],
            root / "backend", timeout=1200,
        )
        run(["npm", "ci"], root / "frontend", timeout=1200)
        return
    raise RunnerFailure("TARGET_REPOSITORY_INVALID", "Target repository is not allowlisted", "blocked")


def run_profile(repo_kind: str, root: Path, profile: str) -> None:
    if profile not in PROFILES:
        raise RunnerFailure("VALIDATION_PROFILE_UNSUPPORTED", "Validation profile is not allowlisted", "blocked")
    prepare_dependencies(repo_kind, root, profile)
    if repo_kind == "lite":
        commands = {
            "unit": [["npm", "test"]],
            "typecheck": [["npm", "run", "typecheck"]],
            "build": [["npm", "run", "build"]],
        }
        selected = commands.get(profile)
        if selected is None:
            raise RunnerFailure("VALIDATION_PROFILE_UNSUPPORTED", "Lite does not expose this profile", "blocked")
        for command in selected:
            run(command, root)
        return
    if profile == "unit":
        run(
            ["python", "-m", "pytest", "-q", "--cov=app", "--cov-report=term-missing",
             "--cov-fail-under=75", "--disable-warnings"],
            root / "backend", timeout=2400,
        )
        run(["npm", "test"], root / "frontend", timeout=1800)
    elif profile == "lint":
        run(["python", "-m", "ruff", "check"], root / "backend")
        run(["npm", "run", "lint"], root / "frontend")
    elif profile == "typecheck":
        run(["npm", "run", "typecheck"], root / "frontend")
    elif profile == "build":
        run(["python", "-m", "compileall", "-q", "app"], root / "backend")
        run(["npm", "run", "build"], root / "frontend")


def fetch_expected_base(root: Path, branch: str, expected_sha: str) -> None:
    if not isinstance(branch, str) or not SAFE_BRANCH.fullmatch(branch) or ".." in branch or "//" in branch:
        raise RunnerFailure("EXPECTED_BRANCH_INVALID", "Expected branch is invalid", "blocked")
    if not isinstance(expected_sha, str) or not SHA40.fullmatch(expected_sha):
        raise RunnerFailure("EXPECTED_SHA_INVALID", "Expected SHA is invalid", "blocked")
    git("fetch", "--no-tags", "origin", "+refs/heads/" + branch + ":refs/remotes/origin/" + branch, cwd=root)
    actual = git("rev-parse", "refs/remotes/origin/" + branch, cwd=root)
    if actual != expected_sha:
        raise RunnerFailure("STALE_EXPECTED_HEAD", "Canonical repository HEAD changed before Runner checkout", "blocked")


def existing_remote_branch(root: Path, branch: str) -> bool:
    output = git("ls-remote", "--heads", "origin", "refs/heads/" + branch, cwd=root, allow_failure=True)
    return bool(output.strip())


def ensure_work_branch(root: Path, command_id: str, expected_sha: str) -> tuple[str, bool]:
    branch = "agent/" + command_id
    if existing_remote_branch(root, branch):
        git("fetch", "origin", "refs/heads/" + branch + ":refs/remotes/origin/" + branch, cwd=root)
        git("checkout", "-B", branch, "refs/remotes/origin/" + branch, cwd=root)
        merge_base = git("merge-base", expected_sha, "HEAD", cwd=root)
        if merge_base != expected_sha:
            raise RunnerFailure("EXISTING_COMMAND_BRANCH_BASE_MISMATCH",
                                "Existing command branch is not based on the expected SHA", "reconcile_required")
        count = git("rev-list", "--count", expected_sha + "..HEAD", cwd=root)
        if count != "1":
            raise RunnerFailure("EXISTING_COMMAND_BRANCH_COMMIT_COUNT_INVALID",
                                "Existing command branch does not contain exactly one command commit", "reconcile_required")
        return branch, True
    git("checkout", "--detach", expected_sha, cwd=root)
    git("checkout", "-b", branch, cwd=root)
    return branch, False


def verify_command_branch(root: Path, expected_sha: str, operations: Any) -> None:
    validated = validate_operations(operations)
    expected_paths = {item["path"] for item in validated}
    changed_paths = set(git("diff", "--name-only", expected_sha + "..HEAD", cwd=root).splitlines())
    if changed_paths != expected_paths:
        raise RunnerFailure("COMMAND_BRANCH_SCOPE_MISMATCH",
                            "Command branch contains files outside its typed patch", "reconcile_required")
    count = git("rev-list", "--count", expected_sha + "..HEAD", cwd=root)
    if count != "1":
        raise RunnerFailure("COMMAND_BRANCH_COMMIT_COUNT_INVALID",
                            "Command branch must contain exactly one command commit", "reconcile_required")


def github_api(method: str, path: str, payload: dict[str, Any] | None = None) -> Any:
    token = os.environ.get("GITHUB_TOKEN", "")
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    if not token or repository not in REPOSITORIES:
        raise RunnerFailure("GITHUB_WORKFLOW_TOKEN_UNAVAILABLE", "GitHub workflow token is unavailable", "blocked")
    url = "https://api.github.com/repos/" + repository + "/" + path.lstrip("/")
    headers = {
        "Authorization": "Bearer " + token,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "precision-lab-bridge-command-runner",
    }
    _, result = http_json(url, method, payload, headers=headers, maximum=128 * 1024)
    return result


def create_or_reuse_pull_request(repository: str, work_branch: str, base_branch: str, command_id: str) -> dict[str, Any]:
    query = urllib.parse.urlencode({
        "state": "open",
        "head": OWNER + ":" + work_branch,
        "base": base_branch,
    })
    existing = github_api("GET", "pulls?" + query)
    if isinstance(existing, list) and len(existing) > 1:
        raise RunnerFailure("GITHUB_PR_AMBIGUOUS", "More than one matching pull request exists", "reconcile_required")
    if isinstance(existing, list) and existing:
        pr = existing[0]
        if isinstance(pr, dict) and pr.get("head", {}).get("ref") == work_branch and pr.get("base", {}).get("ref") == base_branch:
            return pr
        raise RunnerFailure("GITHUB_PR_RESPONSE_INVALID", "Existing pull request did not match the command", "reconcile_required")
    created = github_api("POST", "pulls", {
        "title": "[Bridge] Repository patch " + command_id,
        "head": work_branch,
        "base": base_branch,
        "body": (
            "Automated draft pull request created by the Precision Lab Bridge Runner.\n\n"
            "Command ID: " + command_id + "\n"
            "Source base SHA: verified against the Bridge manifest\n"
            "Validation: allowlisted unit profile passed\n\n"
            "This PR is not auto-merged."
        ),
        "draft": True,
    })
    if not isinstance(created, dict) or not isinstance(created.get("number"), int) or not isinstance(created.get("html_url"), str):
        raise RunnerFailure("GITHUB_PR_RESPONSE_INVALID", "GitHub returned an invalid PR response", "reconcile_required")
    if created["html_url"] != "https://github.com/" + repository + "/pull/" + str(created["number"]):
        raise RunnerFailure("GITHUB_PR_RESPONSE_INVALID", "GitHub PR URL did not match the target repository", "reconcile_required")
    return created


def execute_manifest(manifest: dict[str, Any], root: Path) -> tuple[str, dict[str, Any]]:
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    repo_kind = REPOSITORIES.get(repository)
    if not repo_kind or manifest.get("repository_full_name") != repository:
        raise RunnerFailure("TARGET_REPOSITORY_MISMATCH", "Runner repository did not match the manifest", "blocked")
    command_id = manifest.get("command_id")
    command_type = manifest.get("command_type")
    if not isinstance(command_id, str) or not SAFE_UUID.fullmatch(command_id):
        raise RunnerFailure("COMMAND_ID_INVALID", "Command ID is invalid", "blocked")
    if command_type not in {"repo.inspect", "repo.patch", "repo.validate"}:
        raise RunnerFailure("COMMAND_TYPE_UNSUPPORTED", "Command type is not supported", "blocked")

    expected_branch = manifest.get("expected_branch")
    expected_sha = manifest.get("expected_sha")
    fetch_expected_base(root, expected_branch, expected_sha)
    git("checkout", "--detach", expected_sha, cwd=root)
    base_result: dict[str, Any] = {
        "base_sha": expected_sha,
        "head_sha": expected_sha,
        "runner_run_url": "https://github.com/" + repository + "/actions/runs/" + os.environ["GITHUB_RUN_ID"],
        "validation_conclusion": "not_run",
        "summary": "Repository inspected at the expected canonical HEAD.",
    }

    if command_type == "repo.inspect":
        return "completed", base_result

    payload = manifest.get("payload")
    if not isinstance(payload, dict):
        raise RunnerFailure("COMMAND_PAYLOAD_INVALID", "Command payload is invalid", "blocked")
    if command_type == "repo.validate":
        profile = payload.get("profile")
        if not isinstance(profile, str) or profile not in PROFILES:
            raise RunnerFailure("VALIDATION_PROFILE_INVALID", "Validation profile is invalid", "blocked")
        run_profile(repo_kind, root, profile)
        base_result.update({
            "validation_profile": profile,
            "validation_conclusion": "success",
            "summary": "Allowlisted validation profile passed on the expected canonical HEAD.",
        })
        return "completed", base_result

    operations = payload.get("operations")
    validated = validate_operations(operations)
    branch, reused_branch = ensure_work_branch(root, command_id, expected_sha)
    if reused_branch:
        if not patch_already_applied(root, operations):
            raise RunnerFailure("EXISTING_COMMAND_BRANCH_CONFLICT", "Existing command branch did not match the recorded patch", "reconcile_required")
    else:
        apply_operations(root, operations)
    run_profile(repo_kind, root, "unit")
    base_result.update({
        "validation_profile": "unit",
        "validation_conclusion": "success",
        "summary": "Typed patch applied and the repository unit profile passed.",
    })

    if not reused_branch:
        git("add", "--", *[item["path"] for item in validated], cwd=root)
        staged = git("diff", "--cached", "--name-only", cwd=root)
        if not staged:
            raise RunnerFailure("PATCH_NO_CHANGES", "Patch contained no effective changes", "blocked")
        git("config", "user.name", "precision-lab-runner[bot]", cwd=root)
        git("config", "user.email", "precision-lab-runner[bot]@users.noreply.github.com", cwd=root)
        git("commit", "-m", "feat(agent): apply Bridge command " + command_id, cwd=root)
    verify_command_branch(root, expected_sha, operations)
    # Compare-and-swap again immediately before publishing the isolated branch.
    fetch_expected_base(root, expected_branch, expected_sha)
    if not reused_branch:
        try:
            git("push", "origin", "HEAD:refs/heads/" + branch, cwd=root, timeout=180)
        except RunnerFailure as error:
            raise RunnerFailure("GITHUB_PUSH_OUTCOME_UNKNOWN", str(error), "reconcile_required")
    # Do not open a PR if the canonical base moved during push.
    fetch_expected_base(root, expected_branch, expected_sha)
    commit_sha = git("rev-parse", "HEAD", cwd=root)
    if not SHA40.fullmatch(commit_sha):
        raise RunnerFailure("COMMIT_SHA_INVALID", "Runner commit SHA was invalid", "reconcile_required")
    pr = create_or_reuse_pull_request(repository, branch, expected_branch, command_id)
    base_result.update({
        "head_sha": commit_sha,
        "commit_sha": commit_sha,
        "pull_request_number": pr["number"],
        "pull_request_url": pr["html_url"],
        "summary": "Typed patch validated and published as a draft pull request.",
    })
    return "awaiting_review", base_result


def main() -> int:
    command_id = os.environ.get("BRIDGE_COMMAND_ID", "")
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    root = Path(os.environ.get("GITHUB_WORKSPACE", ".")).resolve()
    if not SAFE_UUID.fullmatch(command_id) or repository not in REPOSITORIES:
        print("::error::Runner command identity is invalid.")
        return 2
    try:
        if urllib.parse.urlsplit(BRIDGE_BASE_URL).hostname != "precision-lab-bridge.onrender.com":
            raise RunnerFailure("BRIDGE_ORIGIN_INVALID", "Bridge URL is not trusted", "blocked")
        manifest = bridge_call(command_id, "claim")
        lease_token = manifest.get("lease_token")
        if not isinstance(lease_token, str) or not SAFE_UUID.fullmatch(lease_token):
            raise RunnerFailure("RUNNER_LEASE_INVALID", "Bridge returned an invalid lease", "blocked")
        try:
            final_status, result = execute_manifest(manifest, root)
            callback = {
                "lease_token": lease_token,
                "status": final_status,
                "error_code": None,
                "result": result,
            }
        except RunnerFailure as error:
            callback = {
                "lease_token": lease_token,
                "status": error.status,
                "error_code": error.code,
                "result": {
                    "summary": str(error)[:1000],
                    "base_sha": manifest.get("expected_sha"),
                    "head_sha": git("rev-parse", "HEAD", cwd=root, allow_failure=True) or manifest.get("expected_sha"),
                    "validation_conclusion": "failure" if error.status == "failed" else "not_run",
                    "runner_run_url": "https://github.com/" + repository + "/actions/runs/" + os.environ["GITHUB_RUN_ID"],
                },
            }
        bridge_call(command_id, "complete", callback)
        if callback["status"] not in {"completed", "awaiting_review"}:
            print("::error::Bridge command ended with status " + callback["status"] + " (" + str(callback["error_code"]) + ").")
            return 1
        print("Bridge command " + command_id + " finished with status " + callback["status"] + ".")
        return 0
    except RunnerFailure as error:
        print("::error::" + error.code + ": " + str(error))
        return 1
    except Exception:
        print("::error::RUNNER_UNEXPECTED_FAILURE. Check the sanitized Bridge receipt before retrying.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
