"""Meaningful invariants: no stale, incomplete, skipped or superseded green reuse."""
import copy
from datetime import datetime, timezone
import unittest
from continuity import fingerprint, manifest_tree, plan


class ContinuityTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 10, 16, 21, 0, tzinfo=timezone.utc)
        self.state = {'schema_version': 1, 'revision': 1, 'repository': 'o/r',
                      'technical_baseline_sha': 'old',
                      'canonical_branch': 'qa/cert', 'prose_only_paths': ['qa/certification/CURRENT_STATE.md'],
                      'next_action': {'id': 'SY-X-04', 'exit_criteria': 'exact sum'}, 'blockers': [],
                      'gates': {'unit': {'workflow': '.github/workflows/test.yml',
                                         'inputs': ['*'], 'acceptance_revision': 'v1'}}}
        self.base = {'src/math.ts': ['100644', 'blob', 'a'],
                     'qa/certification/cases.jsonl': ['100644', 'blob', 'b'],
                     'qa/certification/SG28_DISTRIBUTED_ACCEPTANCE.md': ['100644', 'blob', 'c'],
                     'scripts/certification/continuity.py': ['100644', 'blob', 'd'],
                     'qa/certification/CURRENT_STATE.md': ['100644', 'blob', 'e'],
                     'qa/certification/runner/12345.json': ['100644', 'blob', 'f']}
        self.trees = {'old': self.base, 'head': copy.deepcopy(self.base)}
        self.trees['head']['qa/certification/CURRENT_STATE.md'][2] = 'new prose'
        self.run = {'id': 1, 'path': '.github/workflows/test.yml', 'head_sha': 'old',
                    'created_at': '2026-10-16T20:00:00Z', 'run_attempt': 1,
                    'checkout_sha': 'old',
                    'status': 'completed', 'conclusion': 'success', 'logs_reviewed': True,
                    'evidence_executed': True,
                    'acceptance_revision': 'v1', 'jobs': [{'id': 20, 'status': 'completed', 'conclusion': 'success'}]}
        self.live = {'repository': 'o/r', 'branch': 'qa/cert', 'head_sha': 'head',
                     'fetched_at': '2026-10-16T21:00:00Z', 'runs': [self.run]}

    def decision(self):
        return plan(self.state, self.live, self.trees.__getitem__, self.now)['gates'][0]['decision']

    def test_doc_only_reuses_prior_technical_sha_without_new_pass(self):
        self.assertEqual(self.decision(), 'REUSE')
        result = plan(self.state, self.live, self.trees.__getitem__, self.now)
        self.assertEqual(result['state_status'], 'CURRENT')
        self.assertEqual(result['next_action']['id'], 'SY-X-04')

    def test_unrecorded_technical_head_suppresses_stale_next_objective(self):
        self.trees['head']['src/math.ts'][2] = 'new technical commit'
        result = plan(self.state, self.live, self.trees.__getitem__, self.now)
        self.assertEqual(result['state_status'], 'RECONCILE')
        self.assertIsNone(result['next_action'])
        self.assertEqual(result['gates'][0]['decision'], 'RUN')

    def test_missing_baseline_suppresses_stale_next_objective(self):
        self.state['technical_baseline_sha'] = 'unavailable'
        result = plan(self.state, self.live, self.trees.__getitem__, self.now)
        self.assertEqual(result['state_status'], 'REFRESH')
        self.assertIsNone(result['next_action'])

    def test_external_security_evidence_not_reused(self):
        self.state['gates']['unit']['allow_reuse'] = False
        self.assertEqual(self.decision(), 'REVIEW')

    def test_expired_gate_evidence_not_reused(self):
        self.state['gates']['unit']['max_evidence_age_hours'] = 0.5
        self.assertEqual(self.decision(), 'REVIEW')

    def test_generated_runner_record_does_not_invalidate_evidence(self):
        self.trees['head'] = copy.deepcopy(self.base)
        self.trees['head']['qa/certification/runner/12345.json'][2] = 'new generated record blob'
        self.assertEqual(self.decision(), 'REUSE')
        result = plan(self.state, self.live, self.trees.__getitem__, self.now)
        self.assertEqual(result['state_status'], 'CURRENT')

    def test_each_technical_input_invalidates_evidence(self):
        paths = ['src/math.ts', 'qa/certification/cases.jsonl',
                 'qa/certification/SG28_DISTRIBUTED_ACCEPTANCE.md',
                 'scripts/certification/continuity.py', '.github/workflows/test.yml',
                 'package-lock.json', 'backend/requirements.txt', 'tests/regression.ts',
                 'qa/certification/runner/manifest.json']
        for path in paths:
            with self.subTest(path=path):
                self.trees['head'] = copy.deepcopy(self.base)
                self.trees['head'][path] = ['100644', 'blob', 'changed']
                self.assertEqual(self.decision(), 'RUN')

    def test_running_identical_inputs_wait(self):
        self.run.update(status='in_progress', conclusion=None)
        self.assertEqual(self.decision(), 'WAIT')

    def test_failure_requires_diagnosis(self):
        self.run['conclusion'] = 'failure'
        self.assertEqual(self.decision(), 'DIAGNOSE')

    def test_newer_failure_supersedes_green(self):
        bad = dict(self.run, id=2, conclusion='failure', created_at='2026-10-16T20:30:00Z')
        self.live['runs'] = [self.run, bad]
        self.assertEqual(self.decision(), 'DIAGNOSE')

    def test_retry_attempt_supersedes_green(self):
        bad = dict(self.run, run_attempt=2, conclusion='failure')
        self.live['runs'] = [self.run, bad]
        self.assertEqual(self.decision(), 'DIAGNOSE')

    def test_success_with_skipped_job_cannot_reuse(self):
        self.run['jobs'][0]['conclusion'] = 'skipped'
        self.assertEqual(self.decision(), 'REVIEW')

    def test_skip_only_green_without_executed_origin_cannot_reuse(self):
        self.run['evidence_executed'] = False
        self.assertEqual(self.decision(), 'REVIEW')
        del self.run['evidence_executed']
        self.assertEqual(self.decision(), 'REVIEW')

    def test_unreviewed_logs_or_acceptance_cannot_reuse(self):
        self.run['logs_reviewed'] = False
        self.assertEqual(self.decision(), 'REVIEW')
        self.run['logs_reviewed'] = True
        self.state['gates']['unit']['acceptance_revision'] = 'v2'
        self.assertEqual(self.decision(), 'REVIEW')

    def test_green_event_sha_without_checkout_requires_review(self):
        del self.run['checkout_sha']
        self.assertEqual(self.decision(), 'REVIEW')

    def test_pr_checkout_with_different_technical_inputs_cannot_reuse(self):
        self.run['head_sha'] = 'head'
        self.trees['merge'] = copy.deepcopy(self.base)
        self.trees['merge']['src/math.ts'][2] = 'different merge input'
        self.run['checkout_sha'] = 'merge'
        self.assertEqual(self.decision(), 'REVIEW')

    def test_pr_checkout_equivalent_uses_real_origin_not_event_sha(self):
        self.trees['merge'] = copy.deepcopy(self.base)
        self.trees['unrelated_event_head'] = {'unrelated': ['100644', 'blob', 'x']}
        self.run.update(head_sha='unrelated_event_head', checkout_sha='merge')
        result = plan(self.state, self.live, self.trees.__getitem__, self.now)['gates'][0]
        self.assertEqual(result['decision'], 'REUSE')
        self.assertEqual(result['evidence_sha'], 'merge')
        self.assertEqual(result['event_head_sha'], 'unrelated_event_head')

    def test_unknown_checkout_requires_refresh(self):
        self.run['checkout_sha'] = 'unavailable'
        self.assertEqual(self.decision(), 'REFRESH')

    def test_incomplete_or_duplicate_jobs_cannot_reuse(self):
        job = copy.deepcopy(self.run['jobs'][0])
        self.run['jobs'] = [job, dict(job)]
        self.assertEqual(self.decision(), 'REVIEW')
        self.run['jobs'] = [dict(job, status='in_progress')]
        self.assertEqual(self.decision(), 'REVIEW')
        self.run['jobs'] = [dict(job, id=None)]
        self.assertEqual(self.decision(), 'REVIEW')

    def test_expired_or_future_snapshot_fails_closed(self):
        for value in ['2026-10-16T20:44:59Z', '2026-10-16T21:01:00Z']:
            self.live['fetched_at'] = value
            with self.assertRaises(ValueError):
                self.decision()

    def test_wrong_branch_fails_closed(self):
        self.live['branch'] = 'main'
        with self.assertRaises(ValueError):
            self.decision()

    def test_deleted_input_invalidates(self):
        del self.trees['head']['src/math.ts']
        self.assertEqual(self.decision(), 'RUN')

    def test_unavailable_evidence_source_refreshes(self):
        del self.trees['old']
        self.assertEqual(self.decision(), 'REFRESH')

    def test_manifest_rejects_truncated_tree(self):
        with self.assertRaises(ValueError):
            manifest_tree({'commits': {'head': {'truncated': True, 'tree': []}}}, 'head')


if __name__ == '__main__':
    unittest.main()
