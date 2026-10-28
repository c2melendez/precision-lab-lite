# Precision Lab local deepmerge patch

- Package identity: `deepmerge@4.3.2-precisionlab.1`, a private local patched build, not an upstream release.
- Base: the MIT-licensed deepmerge 4.3.x implementation.
- Security change: reject the exact key `__proto__` in both target-copy and source-copy loops, independent of target shape. This addresses CVE-2026-93753 / GHSA-gcqx-w48m-w2h4.
- Compatibility: retains the upstream TypeScript declaration surface and default array-merge behavior.
- Dependency hygiene: the MIT-licensed `is-mergeable-object` helper is inlined; no additional runtime dependency is introduced.
- Attribution: helper logic is adapted from `is-mergeable-object` by its upstream authors, under the MIT license; the deepmerge MIT license is included alongside this package.
- Verification status: regression tests are included, but this commit does not wire the package into the application or regenerate the root lockfile. Do not treat the vulnerability as remediated until root override, npm-generated lockfile, clean install, npm audit, application tests, typecheck, build and PWA artifacts all pass.
