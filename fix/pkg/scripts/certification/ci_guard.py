#!/usr/bin/env python3
"""Reuse completed CI evidence only when the actual checkout and required steps match.

No external dependencies. Missing credentials, incomplete API responses or API failures
fail open towards RUNNING the tests. A successful run with skipped test steps is never
accepted as evidence. The existing workflow job names remain the branch-protection checks.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request

PROFILES = {
    "lite-cumulative": {"cumulative": ["Certification continuity and CI guard regressions", "Typecheck", "Unit and parity regression", "Production build"]},
    "plus-cumulative": {
        "backend": ["Certification continuity and CI guard regressions", "Backend regression"],
        "frontend": ["Certification continuity and CI guard regressions", "Typecheck", "Unit and parity regression", "Production build"],
    },
    "plus-native": {"syntax-native": ["Native desktop syntax and HTTP recovery", "Native tablet and mobile syntax and HTTP recovery"]},
    "h1d": {"h1d": ["Run IN625 H1d reentry"]},
    "lite-scientific": {"scientific-ui": ["Native desktop/tablet/mobile scientific result verification"]},
}


def real_evidence(jobs, requirements):
    """Every required job must have succeeded, including each named evidence step."""
    if not jobs or any(job.get("status") != "completed" or job.get("conclusion") != "success" for job in jobs):
        return False
    for name, required_steps in requirements.items():
        matches = [job for job in jobs if job.get("name") == name]
        if len(matches) != 1:
            return False
        job = matches[0]
        if job.get("status") != "completed" or job.get("conclusion") != "success":
            return False
        for name in required_steps:
            steps = [step for step in job.get("steps", []) if step.get("name") == name]
            if len(steps) != 1 or steps[0].get("status") != "completed" or steps[0].get("conclusion") != "success":
                return False
    return True


class GitHub:
    def __init__(self, repository, token):
        self.base = "https://api.github.com/repos/" + repository
        self.token = token

    def get(self, path):
        request = urllib.request.Request(self.base + path, headers={
            "Accept": "application/vnd.github+json", "Authorization": "Bearer " + self.token,
            "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "certification-ci-evidence-guard",
        })
        with urllib.request.urlopen(request, timeout=15) as response:
            return json.load(response)

    def jobs(self, run_id, attempt):
        result = []
        for page in range(1, 11):
            payload = self.get(f"/actions/runs/{run_id}/attempts/{attempt}/jobs?per_page=100&page={page}")
            chunk = payload["jobs"]
            result.extend(chunk)
            if len(result) >= payload["total_count"]:
                return result
        raise ValueError("Incomplete job pagination; run gate instead")


def find_evidence(api, workflow, sha, current_run_id, requirements):
    """A newer failure or unfinished run invalidates older green evidence.

    Look through successful no-op runs to find their actual evidence, but never
    cross a failed/cancelled/unfinished run. Pagination is bounded; absence costs
    a run instead of hiding tests.
    """
    query = urllib.parse.urlencode({"head_sha": sha, "per_page": 100})
    candidates = []
    for page in range(1, 4):
        payload = api.get(f"/actions/workflows/{urllib.parse.quote(workflow, safe='')}/runs?{query}&page={page}")
        runs = payload["workflow_runs"]
        candidates.extend(runs)
        if len(runs) < 100:
            break
    candidates.sort(key=lambda run: (run.get("created_at", ""), run.get("run_attempt", 1), int(run["id"])), reverse=True)
    for run in candidates:
        if str(run["id"]) == str(current_run_id) or run.get("head_sha") != sha:
            continue
        if run.get("status") != "completed" or run.get("conclusion") != "success":
            return None
        # A PR normally checks out a merge commit while run metadata identifies
        # its source commit. It cannot supply evidence for a push checkout.
        if run.get("event") not in ("push", "workflow_dispatch"):
            continue
        jobs = api.jobs(run["id"], run["run_attempt"])
        if not jobs or any(job.get("status") != "completed" or job.get("conclusion") != "success" for job in jobs):
            return None
        if real_evidence(jobs, requirements):
            return run["id"]
    return None


def output(skip, sha, evidence=None, reason=""):
    data = {"skip": str(skip).lower(), "checkout_sha": sha,
            "evidence_run_id": str(evidence or ""), "reason": reason}
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as stream:
            for key, value in data.items():
                stream.write(f"{key}={value}\n")
    print(json.dumps(data, ensure_ascii=False))
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as stream:
            stream.write(f"\n### Certification evidence guard\n\nCheckout: `{sha}`. Decision: **{'REUSE' if skip else 'RUN'}**.\n\n")
            if evidence:
                repo = os.environ["GITHUB_REPOSITORY"]
                stream.write(f"Evidence: [{evidence}](https://github.com/{repo}/actions/runs/{evidence}).\n\n")
            stream.write(reason + "\n")
            if skip:
                stream.write("This run reuses earlier evidence; skipped steps are not new certification evidence.\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--profile", required=True, choices=PROFILES)
    args = parser.parse_args()
    sha = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Invalid checkout SHA")
    if os.environ.get("GITHUB_EVENT_NAME") == "workflow_dispatch":
        reason = os.environ.get("REVALIDATION_REASON", "").strip()
        if not reason:
            sys.exit("Manual revalidation requires a nonempty reason.")
        # JSON log safely preserves the untrusted reason. It is not injected into
        # commands, workflow outputs or the Markdown job summary.
        print(json.dumps({"revalidation_reason": reason}, ensure_ascii=False))
        output(False, sha, reason="Manual revalidation requested with a recorded reason.")
        return
    try:
        token = os.environ.get("GITHUB_TOKEN", "")
        if not token:
            raise ValueError("No actions-read token")
        workflow_ref = os.environ["GITHUB_WORKFLOW_REF"]
        workflow = workflow_ref.split("@", 1)[0].rsplit("/", 1)[-1]
        api = GitHub(os.environ["GITHUB_REPOSITORY"], token)
        evidence = find_evidence(api, workflow, sha, os.environ["GITHUB_RUN_ID"], PROFILES[args.profile])
        output(bool(evidence), sha, evidence, "Required jobs and evidence steps succeeded on this exact SHA." if evidence else "No reusable completed evidence found.")
    except Exception as exc:
        print(f"Guard could not verify evidence ({type(exc).__name__}); executing gate.", file=sys.stderr)
        output(False, sha, reason="Evidence lookup unavailable or incomplete; execute all required tests.")


if __name__ == "__main__":
    main()
