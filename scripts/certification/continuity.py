#!/usr/bin/env python3
"""Read-only certification planner. Never dispatches, cancels or declares new PASS.

An observation file must come from a fresh GitHub API read, not the ledger.
See qa/certification/CONTINUITY.md for its schema and review requirements.
"""
import argparse
from datetime import datetime, timezone, timedelta
import fnmatch
import hashlib
import json
import re
from pathlib import Path
import subprocess


def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args]).decode().strip()


def tree(root, sha):
    result = {}
    for entry in git(root, 'ls-tree', '-r', '-z', sha).split('\0'):
        if entry:
            meta, path = entry.split('\t', 1)
            mode, kind, oid = meta.split()
            result[path] = [mode, kind, oid]
    return result


def selected(path, gate, prose_paths):
    # Exact, reviewed exclusions only. Generated numeric runner records are
    # audit metadata written after a run; they must not invalidate its inputs.
    if (path in prose_paths
            or path == 'qa/certification/continuity.json'
            or re.fullmatch(r'qa/certification/runner/[0-9]{1,20}\.json', path)):
        return False
    return any(fnmatch.fnmatchcase(path, pattern) for pattern in gate['inputs'])


def fingerprint(entries, gate, prose_paths):
    payload = {'planner_version': 2, 'gate': gate,
               'inputs': {p: v for p, v in sorted(entries.items())
                          if selected(p, gate, prose_paths)}}
    return hashlib.sha256(json.dumps(payload, sort_keys=True,
                                    separators=(',', ':')).encode()).hexdigest()


def manifest_tree(manifest, sha):
    source = manifest['commits'][sha]
    if source.get('truncated', True):
        raise ValueError('recursive Git tree is truncated or completeness not recorded')
    return {item['path']: [item['mode'], item['type'], item['sha']]
            for item in source['tree'] if item['type'] != 'tree'}


def parse_time(value):
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if parsed.tzinfo is None:
        raise ValueError('timestamp must include timezone')
    return parsed.astimezone(timezone.utc)


def plan(state, live, tree_at, now=None):
    now = now or datetime.now(timezone.utc)
    if state.get('schema_version') != 1:
        raise ValueError('unsupported continuity schema')
    if (live['repository'], live['branch']) != (state['repository'], state['canonical_branch']):
        raise ValueError('repository/branch mismatch: rediscover canonical branch')
    age = now - parse_time(live['fetched_at'])
    if age < timedelta(seconds=-30) or age > timedelta(minutes=15):
        raise ValueError('GitHub snapshot expired or future-dated; refresh it')
    current = tree_at(live['head_sha'])
    cache = {live['head_sha']: current}
    # The next objective is valid only while the recorded technical baseline
    # still describes HEAD. Never carry a stale objective into a new session.
    guard = {'workflow': '__snapshot_guard__', 'inputs': ['*'],
             'acceptance_revision': 'snapshot-v1'}
    try:
        baseline = tree_at(state['technical_baseline_sha'])
        same_baseline = (fingerprint(current, guard, state['prose_only_paths']) ==
                         fingerprint(baseline, guard, state['prose_only_paths']))
        state_status = 'CURRENT' if same_baseline else 'RECONCILE'
    except (KeyError, ValueError, subprocess.CalledProcessError):
        state_status = 'REFRESH'
    results = []
    for name, gate in state['gates'].items():
        if not gate.get('acceptance_revision'):
            raise ValueError('gate acceptance_revision required')
        if not gate.get('inputs') or not selected(gate['workflow'], gate, state['prose_only_paths']):
            raise ValueError('gate inputs must include its workflow; empty scope is unsafe')
        inputs = fingerprint(current, gate, state['prose_only_paths'])
        item = {'gate': name, 'input_fingerprint': inputs,
                'head_sha': live['head_sha'], 'decision': 'RUN',
                'reason': 'no verified equivalent run in fresh observations'}
        # Missing older observations is safe: it may cost a run, never invent PASS.
        relevant = []
        unavailable = []
        for run in live['runs']:
            if run['path'] != gate['workflow']:
                continue
            # PR head_sha can differ from the checkout of the synthetic merge.
            # Use the observed checkout when available. A matching event SHA
            # alone only establishes relevance (WAIT/REVIEW), never REUSE.
            observed = run.get('checkout_sha')
            candidate = observed or run['head_sha']
            try:
                if candidate not in cache:
                    cache[candidate] = tree_at(candidate)
                same = fingerprint(cache[candidate], gate,
                                   state['prose_only_paths']) == inputs
            except (KeyError, ValueError, subprocess.CalledProcessError):
                # An unavailable executed tree cannot be silently superseded
                # by an older green when this event may cover the same inputs.
                unavailable.append(run)
                continue
            if same:
                relevant.append((run, bool(observed)))
            elif observed:
                try:
                    event = run['head_sha']
                    if event not in cache:
                        cache[event] = tree_at(event)
                    event_same = fingerprint(cache[event], gate,
                                             state['prose_only_paths']) == inputs
                except (KeyError, ValueError, subprocess.CalledProcessError):
                    unavailable.append(run)
                    continue
                if event_same:
                    # A different executed tree cannot cover the current
                    # inputs even when the event tree is equivalent.
                    relevant.append((run, False))
        # API order is not authoritative; most recent attempt supersedes old green.
        def order(run):
            return (parse_time(run['created_at']), run.get('run_attempt', 1), run['id'])
        relevant.sort(key=lambda pair: order(pair[0]), reverse=True)
        if relevant and any(order(run) >= order(relevant[0][0]) for run in unavailable):
            item.update(decision='REFRESH', reason='newer workflow observation has unavailable source objects; do not reuse older green',
                        unavailable_run_ids=[run['id'] for run in unavailable])
        elif relevant:
            run, checkout_verified = relevant[0]
            item['run_id'] = run['id']
            item['event_head_sha'] = run['head_sha']
            if run.get('checkout_sha'):
                item['evidence_sha'] = run['checkout_sha']
            if run['status'] != 'completed':
                item.update(decision='WAIT', reason='equivalent inputs already queued/running; inspect existing run')
            elif run['conclusion'] == 'success':
                jobs = run.get('jobs', [])
                max_age = gate.get('max_evidence_age_hours')
                expired = max_age is not None and now - parse_time(run['created_at']) > timedelta(hours=max_age)
                if gate.get('allow_reuse', True) is False:
                    item.update(decision='REVIEW', reason='dynamic external evidence: review current advisories/preconditions before scheduling; prior green cannot be reused automatically')
                elif expired:
                    item.update(decision='REVIEW', reason='evidence age exceeds this gate policy; reassess current external inputs before scheduling')
                elif (checkout_verified and run.get('logs_reviewed') is True and run.get('evidence_executed') is True and jobs
                        and run.get('acceptance_revision') == gate['acceptance_revision']
                        and len({j.get('id') for j in jobs}) == len(jobs)
                        and all(type(j.get('id')) is int and j['id'] > 0 and j.get('status') == 'completed'
                                and j.get('conclusion') == 'success' for j in jobs)):
                    item.update(decision='REUSE', reason='prior reviewed evidence covers identical gate inputs; not a new execution or global certification')
                else:
                    item.update(decision='REVIEW', reason='success metadata needs verified equivalent checkout, actual required-step execution/origin evidence, logs, complete distinct jobs and current acceptance_revision review before reuse')
            elif run['conclusion'] in ('failure', 'timed_out', 'action_required'):
                item.update(decision='DIAGNOSE', reason='same inputs already failed; classify cause and record a change or justified retry before dispatch')
            else:
                item.update(decision='REVIEW', reason='cancelled/skipped/neutral run is not PASS; establish why before rerunning')
        elif unavailable:
            item.update(decision='REFRESH', reason='workflow runs exist but source objects unavailable; fetch evidence commits before scheduling', unavailable_run_ids=[run['id'] for run in unavailable])
        results.append(item)
    return {'repository': state['repository'], 'branch': state['canonical_branch'],
            'observed_head': live['head_sha'], 'state_revision': state['revision'],
            'state_status': state_status,
            'next_action': state['next_action'] if state_status == 'CURRENT' else None,
            'reconciliation_action': None if state_status == 'CURRENT' else
                'Refresh baseline objects and reconcile technical HEAD, evidence and ledger before choosing the next objective',
            'blockers': state['blockers'],
            'gates': results,
            'publication_rule': 'Refresh remote HEAD immediately before publishing; use expected_sha compare-and-swap. No persistent lock.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', default='.')
    parser.add_argument('--state', default='qa/certification/continuity.json')
    parser.add_argument('--observations')
    parser.add_argument('--manifest', help='JSON {commits: {commit_sha: {tree: [...], truncated: false}}}')
    parser.add_argument('--fingerprint', metavar='GATE', help='compute inputs only, without claiming evidence')
    parser.add_argument('--sha', help='exact commit for --fingerprint (default checkout HEAD)')
    args = parser.parse_args()
    root = Path(args.repo)
    try:
        state = json.loads((root / args.state).read_text())
        if args.manifest:
            manifest = json.loads(Path(args.manifest).read_text())
            tree_at = lambda sha: manifest_tree(manifest, sha)
        else:
            tree_at = lambda sha: tree(root, sha)
        if args.fingerprint:
            sha = args.sha or git(root, 'rev-parse', 'HEAD')
            print(json.dumps({'gate': args.fingerprint, 'sha': sha,
                              'input_fingerprint': fingerprint(tree_at(sha), state['gates'][args.fingerprint], state['prose_only_paths'])}))
            return
        if not args.observations:
            raise ValueError('--observations is required for planning')
        live = json.loads(Path(args.observations).read_text())
        if not args.manifest:
            if git(root, 'rev-parse', 'HEAD') != live['head_sha']:
                raise ValueError('checkout HEAD differs from freshly observed remote HEAD')
            if git(root, 'status', '--porcelain'):
                raise ValueError('checkout has unpublished changes; plan again after committing the exact candidate')
        result = plan(state, live, tree_at)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except (ValueError, KeyError, TypeError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(2, f'REFRESH: {error}\n')


if __name__ == '__main__':
    main()
