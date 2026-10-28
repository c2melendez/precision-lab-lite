# CRITICAL — Restore `src/engine/algebriteClient.ts`

**Incident (2026-10-28 UTC):** During R324 automation, three accidental commits overwrote
`src/engine/algebriteClient.ts` with placeholder strings (`PLACEHOLDER`, `see_next`,
`file:///...`). The file is **broken** on `qa/syntax-audit-in625-a1` tip.

**Last good content:** commit `44924ff5ef485948eb2a20d547980d393520884c`
(blob SHA was `5993bc983828026d81df1ca93d7eab1d9b7b8760`).

## Recovery (run locally with push access)

```bash
git fetch origin
git checkout qa/syntax-audit-in625-a1
git checkout 44924ff5ef485948eb2a20d547980d393520884c -- src/engine/algebriteClient.ts
git add src/engine/algebriteClient.ts
git commit -m "fix(h2): restore algebriteClient.ts from 44924ff5 after placeholder overwrite"
git push origin qa/syntax-audit-in625-a1
```

## Optional R324 factorial bound (after restore)

Apply the patch in `qa/certification/R324_factorial_bound.patch` (also under artifacts),
or re-request the agent to re-apply EN-SG-25 once the file is restored.

Do **not** claim R324 PASS until restore + CI green.
