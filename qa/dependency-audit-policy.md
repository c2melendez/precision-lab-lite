# Lite dependency audit policy

**Status:** temporary, evidence-backed exception for the development/build toolchain  
**Reviewed:** 2026-11-06  
**Applies to:** `feature/m2-command-runner-bridge` and its follow-up fix branch

## CI enforcement

The frontend CI runs two distinct audits:

1. `npm audit --omit=dev --package-lock-only` is the **blocking gate**. Any vulnerability in the production dependency tree fails the frontend job and prevents typecheck, unit/parity tests and build from being treated as a successful CI run.
2. `npm audit --package-lock-only --json` audits the **complete dependency tree** and is retained as the `lite-npm-audit` artifact for 14 days. The audit command's exit is captured so the complete report can be checked and uploaded; `scripts/check-npm-audit-exceptions.mjs` then accepts only the exact four-package chain and the one reviewed GHSA below. Any additional advisory, package, version, severity or package-lock dev/runtime classification fails CI.

## Current exception: GHSA-gcqx-w48m-w2h4

The 2026-10-31 audit artifact for HEAD `c6813092c12b84212b64a14db540d67eb95b4915` reported four LOW findings, all one transitive chain:

`vite-plugin-pwa@2.0.0` → `workbox-build@7.4.1` → `@rollup/plugin-node-resolve@16.0.3` → `deepmerge@4.3.1`.

The affected packages are marked development dependencies in `package-lock.json`. The GitHub-reviewed advisory [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) identifies `deepmerge >=4.2.0, <=4.3.1` as affected and lists **no patched versions** as of this review. The issue is prototype poisoning in objects returned by `mergeObject()`.

This is not a claim that the tooling chain is risk-free: these packages execute during installation/build workflows. The temporary gate separation keeps the production runtime audit blocking while retaining and surfacing the entire development-tree report. Revisit when the upstream advisory or dependency chain changes; remove this exception when a fixed version is available and verified.

## Remediation deliberately not applied

Do not run `npm audit fix --force` for this advisory. The artifact's proposed package-level downgrade is a SemVer-major change to `vite-plugin-pwa`, not a patched `deepmerge` release. Do not downgrade or replace the PWA plugin merely to obtain a green audit without validating the PWA integration, service-worker generation and offline behavior.

## Evidence required to close

- A current full audit artifact with no GHSA-gcqx-w48m-w2h4 finding, or a documented upstream fix plus a compatible dependency-chain upgrade.
- Successful PWA offline and production-build checks after any dependency update.
- The production audit remains clean.
