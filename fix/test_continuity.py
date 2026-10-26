"""Meaningful invariants: no stale, incomplete, skipped or superseded green reuse."""
import copy
from datetime import datetime, timezone
import unittest
from continuity import fingerprint, manifest_tree, plan, selected


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
                     'qa/certification/CURRENT_STATE.md': ['100644', 'blob', 'e']}
        self.trees = {'old': self.base, 'head': copy.deepcopy(self.base)}
        self.trees['head']['qa/certification/CURRENT_STATE.md'][2] = 'new prose'
        self.run = {'id': 1, 'path': '.github/workflows/test.yml', 'head_sha': 'old',
                    'created_at': '2026-10-16T20:00:00Z', 'run_attempt': 1,
                    'status': 'completed', 'conclusion': 'success', 'logs_reviewed': True,
                    'evidence_executed': True,
                    'acceptance_revision': 'v1', 'jobs': [{'id': 20, 'conclusion': 'success'}]}
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

    def test_each_technical_input_invalidates_evidence(self):
        paths = ['src/math.ts', 'qa/certification/cases.jsonl',
                 'qa/certification/SG28_DISTRIBUTED_ACCEPTANCE.md',
                 'scripts/certification/continuity.py', '.github/workflows/test.yml',
                 'package-lock.json', 'backend/requirements.txt', 'tests/regression.ts']
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


class RunnerRecordExclusionTests(unittest.TestCase):
    """Hallazgo A: los registros de ejecución generados por el certification
    runner (qa/certification/runner/<run_id>.json) son SALIDAS de una corrida,
    no entradas técnicas. Si contaran como entradas, cada registro publicado
    alteraría la huella y el planificador volvería a RECONCILE en bucle."""

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
                     'qa/certification/SY_P_23_CONVENTION.md': ['100644', 'blob', 'c'],
                     'scripts/certification/continuity.py': ['100644', 'blob', 'd'],
                     '.github/workflows/test.yml': ['100644', 'blob', 'e'],
                     'package-lock.json': ['100644', 'blob', 'f'],
                     'qa/certification/CURRENT_STATE.md': ['100644', 'blob', 'g']}
        self.trees = {'old': copy.deepcopy(self.base), 'head': copy.deepcopy(self.base)}
        self.run = {'id': 1, 'path': '.github/workflows/test.yml', 'head_sha': 'old',
                    'created_at': '2026-10-16T20:00:00Z', 'run_attempt': 1,
                    'status': 'completed', 'conclusion': 'success', 'logs_reviewed': True,
                    'evidence_executed': True,
                    'acceptance_revision': 'v1', 'jobs': [{'id': 20, 'conclusion': 'success'}]}
        self.live = {'repository': 'o/r', 'branch': 'qa/cert', 'head_sha': 'head',
                     'fetched_at': '2026-10-16T21:00:00Z', 'runs': [self.run]}

    def decision(self):
        return plan(self.state, self.live, self.trees.__getitem__, self.now)['gates'][0]['decision']

    def state_status(self):
        return plan(self.state, self.live, self.trees.__getitem__, self.now)['state_status']

    def test_record_added_after_green_evidence_does_not_reopen_run(self):
        # HEAD gana un registro del runner tras la evidencia verde: la huella
        # técnica es idéntica, así que la evidencia sigue siendo REUSE.
        self.assertEqual(self.decision(), 'REUSE')
        self.trees['head']['qa/certification/runner/40352572002.json'] = ['100644', 'blob', 'r1']
        self.assertEqual(self.decision(), 'REUSE')

    def test_record_only_commit_keeps_state_current_and_no_reconcile_loop(self):
        # El baseline se registra sin el archivo de registro; el commit que lo
        # añade no debe provocar RECONCILE (el ciclo documentado en el hallazgo).
        self.trees['old'] = {k: v for k, v in self.base.items()}
        self.trees['head']['qa/certification/runner/999.json'] = ['100644', 'blob', 'r1']
        self.trees['head']['qa/certification/runner/1000.json'] = ['100644', 'blob', 'r2']
        self.assertEqual(self.state_status(), 'CURRENT')

    def test_record_content_change_also_excluded(self):
        self.trees['head']['qa/certification/runner/40352572002.json'] = ['100644', 'blob', 'r1']
        before = fingerprint(self.trees['head'], self.state['gates']['unit'], self.state['prose_only_paths'])
        self.trees['head']['qa/certification/runner/40352572002.json'] = ['100644', 'blob', 'r1-edited']
        after = fingerprint(self.trees['head'], self.state['gates']['unit'], self.state['prose_only_paths'])
        self.assertEqual(before, after)

    def test_protected_inputs_still_count(self):
        # La exclusión es SOLO para registros generados: contratos, fixtures,
        # tests, workflows y archivos de dependencias siguen siendo entradas.
        gate = self.state['gates']['unit']
        prose = self.state['prose_only_paths']
        reference = fingerprint(self.base, gate, prose)
        protected = ['qa/certification/cases.jsonl', 'qa/certification/SY_P_23_CONVENTION.md',
                     'qa/certification/contracts/sy_x_04.json', 'scripts/certification/test_continuity.py',
                     '.github/workflows/test.yml', 'package.json', 'package-lock.json',
                     'tests/regression.ts', 'qa/certification/check_syntax309_fixture.py']
        for path in protected:
            with self.subTest(path=path):
                entries = copy.deepcopy(self.base)
                entries[path] = ['100644', 'blob', 'changed']
                self.assertNotEqual(fingerprint(entries, gate, prose), reference)

    def test_whole_certification_folder_is_not_excluded(self):
        # Sería inseguro excluir qa/certification/ en bloque: cualquier archivo
        # no permitido explícitamente dentro de la carpeta cuenta como entrada.
        gate = self.state['gates']['unit']
        prose = self.state['prose_only_paths']
        entries = copy.deepcopy(self.base)
        entries['qa/certification/EVIDENCE_NOT_REVIEWED.md'] = ['100644', 'blob', 'x']
        self.assertTrue(selected('qa/certification/EVIDENCE_NOT_REVIEWED.md', gate, prose))
        entries2 = copy.deepcopy(self.base)
        entries2['qa/certification/runner_legacy_notes.md'] = ['100644', 'blob', 'y']
        self.assertTrue(selected('qa/certification/runner_legacy_notes.md', gate, prose))
        self.assertFalse(selected('qa/certification/runner/123.json', gate, prose))

    def test_deleting_a_record_does_not_change_fingerprint_either(self):
        self.trees['head']['qa/certification/runner/40352572002.json'] = ['100644', 'blob', 'r1']
        with_record = fingerprint(self.trees['head'], self.state['gates']['unit'], self.state['prose_only_paths'])
        without = {k: v for k, v in self.trees['head'].items() if k != 'qa/certification/runner/40352572002.json'}
        self.assertEqual(with_record, fingerprint(without, self.state['gates']['unit'], self.state['prose_only_paths']))
