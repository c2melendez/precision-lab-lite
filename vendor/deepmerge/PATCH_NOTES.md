# PATCH_NOTES — deepmerge 4.3.2-private.1

Local patched build of `deepmerge` 4.3.1. **This is not an upstream release.**

- Upstream project: https://github.com/TehShrike/deepmerge
- Upstream advisory: GHSA-gcqx-w48m-w2h4 / CVE-2026-93753
- Upstream report: https://github.com/TehShrike/deepmerge/issues/273
- Affected range declared by the advisory: `>= 4.2.0, <= 4.3.1`
- Upstream patch status at vendoring time: no patched release and no `first_patched_version`

## Why this package exists

`vite-plugin-pwa@1.3.0` → `workbox-build@7.4.1` → `@rollup/plugin-node-resolve@16.0.3`
→ `deepmerge@4.3.1`. The advisory leaves `deepmerge` unpatched, and npm's only
suggested remedy is removing the parent chain (a major downgrade of
`vite-plugin-pwa`), which is not acceptable for the PWA delivery path.

## Differences from upstream 4.3.1

Base file: `deepmerge@4.3.1` `dist/cjs.js` (the published bundle), renamed to
`index.js` and de-bundled only in comments. The `is-mergeable-object` helper is
inlined exactly as the upstream bundle inlines it; no new dependency is added.

1. `keyIsForbidden(key)` rejects the key names `__proto__`, `constructor` and
   `prototype` in **both** loops of `mergeObject()` — the source loop and the
   previously ungated target-copy loop. The check is a pure function of the key,
   so a null-prototype target, a `null` placeholder value, or an own
   `__proto__` key can no longer defeat the guard.
2. Writes use `Object.defineProperty` through `defineDataProperty()` so the
   `__proto__` accessor is never invoked, regardless of the key name.
3. `propertyIsOnObject()` fails closed: a throwing `in` (for example a Proxy
   trap) is treated as unsafe instead of absent.
4. `propertyIsUnsafe()` and the inherited-key protection of 4.3.1 are kept, so
   existing behavior for `toString`/`hasOwnProperty` shadowing attempts is
   unchanged.

The public API (`merge`, `merge.all`, `Options`, `ArrayMergeOptions`) and the
`index.d.ts` surface are untouched.

## Wiring into the root package

`package.json`:

```json
"devDependencies": { "deepmerge": "file:vendor/deepmerge" },
"overrides": { "deepmerge": "$deepmerge" }
```

Two findings from wiring this:

- A relative `file:` value written directly in `overrides`
  (`"deepmerge": "file:vendor/deepmerge"`) is resolved **relative to the
  dependent package**, not to the root. npm 11 then records a broken link such as
  `node_modules/@rollup/plugin-node-resolve/vendor/deepmerge`, which does not
  exist. That form is rejected.
- The supported form is a root `file:` dependency plus the `"$deepmerge"`
  override, which forces every dependent to the single hoisted root copy. The
  resulting lockfile contains `node_modules/deepmerge` → link to
  `vendor/deepmerge` and no registry `deepmerge` entry at all.

The override ignores semver ranges by design. If a future dependency requires
`deepmerge@^5`, this override will force 4.3.2 into it; review then, do not
silently drop the override.

## Known behavior change

Own keys literally named `constructor` or `prototype` in a merged object are
dropped instead of being copied. Upstream's JSON-facing consumers do not rely on
those names; the regression suite asserts the drop explicitly so the change is
auditable rather than silent.

## Verification

`node --test test/prototype-poisoning.node-test.cjs` runs the four attacker variants from the advisory plus
parity checks for arrays, `all()`, `clone: false`, `customMerge`, symbol keys and
special objects.
