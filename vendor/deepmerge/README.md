# deepmerge (local patched build)

This directory vendors a patched copy of `deepmerge@4.3.1`, consumed through the
root `package.json` override, to remediate GHSA-gcqx-w48m-w2h4 / CVE-2026-93753
while upstream has no patched release.

- Runtime entrypoint: `index.js` (CommonJS, same shape as upstream's
  `dist/cjs.js`)
- Types: `index.d.ts` (unchanged upstream surface)
- Patch details: `PATCH_NOTES.md`
- License: MIT, upstream copyright retained in `LICENSE`

Do not publish this package. Do not treat its version (`4.3.2-private.1`) as an
upstream release; it only exists to satisfy the `^4.2.2` range requested by
`@rollup/plugin-node-resolve` and to keep a single hoisted copy in the tree.

Run the local regressions with:

```
node --test vendor/deepmerge/test/prototype-poisoning.node-test.cjs
```
