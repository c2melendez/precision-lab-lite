# deepmerge local patch — S25 dependency remediation (Lite, r322)

**Status:** IMPLEMENTED — npm audit gate green and full CI green on `944e940c`; see "CI evidence" below.
**Scope:** Lite dependency tree only. The adopted package is a private patched build, not an upstream release.
**Global certification:** OPEN. This document does not close `SECURITY-S25` by itself.

## Advisory

| Field | Value |
|---|---|
| Advisory | [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) |
| CVE | CVE-2026-93753 |
| Upstream report | [TehShrike/deepmerge#273](https://github.com/TehShrike/deepmerge/issues/273) |
| Affected range | `>= 4.2.0, <= 4.3.1` |
| Patched upstream version | none (`first_patched_version` is null) |
| GitHub severity | low; the reporter claims CVSS 3.1 7.5 and the upstream maintainer disputes the report |
| Chain in Lite | `vite-plugin-pwa@1.3.0` → `workbox-build@7.4.1` → `@rollup/plugin-node-resolve@16.0.3` → `deepmerge@4.3.1` |

`npm audit` classified the four findings as LOW and offered no non-breaking fix: its only suggestion was removing the parent chain (a major downgrade of `vite-plugin-pwa`), which would break the PWA delivery path. The CI hard gate blocks any severity, so the tree had to be fixed rather than the threshold relaxed.

## Pre-patch reproduction (upstream 4.3.1, unmodified)

Probed against `node_modules/deepmerge@4.3.1` before wiring the patch:

```
v1 admin: true | proto is Object.prototype: false
v2.session admin: true | own admin: false
```

- v1: `merge(Object.create(null), JSON.parse('{"__proto__":{"admin":true}}'))`
- v2: `merge({ session: null }, JSON.parse('{"session":{"__proto__":{"admin":true}}}'))`

Both returned objects inherit an attacker-chosen prototype: the property is not own, so `Object.keys`, `JSON.stringify` and `hasOwnProperty` filters do not see it. `Object.prototype` itself is not modified, which is why the upstream regression suite passes.

## Patch

`vendor/deepmerge/index.js` is the published `deepmerge@4.3.1` bundle (`dist/cjs.js`) with four changes:

1. `keyIsForbidden(key)` rejects `__proto__`, `constructor` and `prototype` in both loops of `mergeObject()` — source loop and the previously ungated target-copy loop. The decision is a pure function of the key, so a null-prototype target, a `null` placeholder or an own `__proto__` key can no longer defeat the guard.
2. Writes go through `Object.defineProperty` (`defineDataProperty`), so the `__proto__` accessor is never invoked.
3. `propertyIsOnObject()` fails closed: a throwing `in` is treated as unsafe, not absent.
4. The inherited-key protection of 4.3.1 (`propertyIsUnsafe`) is preserved, so attempts to shadow `toString`/`hasOwnProperty` still behave as before.

The `is-mergeable-object@1.1.0` helper is inlined exactly as the upstream bundle inlines it; no new transitive dependency is introduced. `index.d.ts` keeps the upstream API surface.

Known behavior change: own keys literally named `constructor` or `prototype` are dropped instead of copied. The regression suite asserts this explicitly.

## Wiring

```json
"devDependencies": { "deepmerge": "file:vendor/deepmerge" },
"overrides": { "deepmerge": "$deepmerge" }
```

Finding worth recording: a relative `file:` value written directly inside `overrides` is resolved **relative to the dependent package**, not to the root. npm 11 then wrote a broken link at `node_modules/@rollup/plugin-node-resolve/vendor/deepmerge` that does not exist. That form was rejected. The working form is a root `file:` dependency plus the `"$deepmerge"` override, which forces the single hoisted root copy.

Lockfile consequence (verified): `node_modules/deepmerge` → link to `vendor/deepmerge`, plus a `vendor/deepmerge` entry at version `4.3.2`. There is no registry `deepmerge` entry left. The version `4.3.2` exists only to satisfy the `^4.2.2` range that `@rollup/plugin-node-resolve` requests; the package is `"private": true` and its README/PATCH_NOTES say it is not an upstream release. The override ignores semver ranges by design, so a future `deepmerge@^5` consumer will be forced to 4.3.2 until reviewed.

## Local validation on `944e940c`

| Check | Result |
|---|---|
| `node --test vendor/deepmerge/test/prototype-poisoning.node-test.cjs` | 13 passed, 0 failed (4 attacker variants + parity) |
| `npm ci` (npm 11.17.0, Windows) | clean, 442 packages |
| `npm ci --dry-run` (npm 10.9.9, CI's major) | lock/package.json in sync |
| `npm ls deepmerge --all` | one copy: `deepmerge@4.3.2` deduped → `.\vendor\deepmerge` |
| `npm audit --package-lock-only --json` | 0 vulnerabilities (npm 11 and npm 10) |
| `require.resolve` from `@rollup/plugin-node-resolve` | resolves `vendor/deepmerge/index.js` |
| `npm run typecheck` | passed |
| `npm test` | 2,228 passed, 8 expected fail, 34 todo; 4 Algebra timeout failures under 360 parallel workers, all 4 files pass in isolation in 8.2 s (load-induced, not patch-related) |
| `npm run build` | exit 0; PWA `dist/sw.js` + `dist/workbox-9c191d2f.js`, 31 precache entries (2,433.13 KiB) |

## CI evidence on `944e940c`

- CI [40612899135](https://github.com/c2melendez/precision-lab-lite/actions/runs/40612899135): SUCCESS (job `frontend`). `npm ci` clean; the audit gate printed `found 0 vulnerabilities`; the new `Vendor deepmerge patch regressions` step ran `# tests 13 / # pass 13`; typecheck passed; `Tests 2,232 passed | 8 expected fail | 34 todo (2,274)` across `Test Files 360 passed (360)`; production build `built in 7.34s`; PWA `precache 31 entries (2,433.11 KiB)` with `dist/sw.js` and `dist/workbox-*.js` generated.
- Cumulative gate [40612899133](https://github.com/c2melendez/precision-lab-lite/actions/runs/40612899133): SUCCESS.
- Dependency/security workflow [40612899246](https://github.com/c2melendez/precision-lab-lite/actions/runs/40612899246): SUCCESS. `security / frontend-security` ran `npm ci`, the audit report, `npm audit --audit-level=high`, the production build and the referrer-policy check. Its `s25-lite-npm-audit` artifact (ID `12783905693`) reports `total: 0`, `low: 0`, `moderate: 0`, `high: 0`, `critical: 0`.
- The strict CI gate (`npm audit --package-lock-only --json`) is the one that previously failed with four LOW findings; it now exits 0 with nothing to report.

## Limits

- This is not an upstream fix. If upstream publishes a patched release, replace the vendor directory with the registry package and delete the override.
- The patch is validated by the vendored regression file plus the fact that `workbox-build` generates the service worker through the patched package. It does not prove the absence of other prototype-injection paths in the build chain.
- `SECURITY-S25` needs explicit bilateral acceptance and its own exit criteria; a green gate here is evidence, not closure.
