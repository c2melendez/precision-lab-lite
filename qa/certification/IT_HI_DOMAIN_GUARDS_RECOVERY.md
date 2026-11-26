# IT-HI interval domain guards — recovery

## Status

- **Helper on branch:** `src/engine/stepEngine/itHiDomainGuards.ts`
  (commit `ab8d77b`) exports `assertInverseHyperbolicIntegralDomain`.
- **Broken:** `src/engine/stepEngine/calculus.ts` was truncated by a
  failed large-file upload. HEAD is not usable for CI.
- **Last good tree:** `b6d0d4dc9f3fee0b3169c91c32ae2b0828436199`
  (intact calculus.ts + domain-guard tests).

## Recovery (required)

```bash
git fetch origin
git checkout qa/syntax-audit-in625-a1
git reset --hard b6d0d4dc9f3fee0b3169c91c32ae2b0828436199

# Re-apply helper file from current origin tip (or cherry-pick ab8d77b path)
git checkout origin/qa/syntax-audit-in625-a1 -- src/engine/stepEngine/itHiDomainGuards.ts
```

### Wire the guard into `calcDefiniteIntegral`

1. Add import:

```typescript
import { assertInverseHyperbolicIntegralDomain } from "./itHiDomainGuards";
```

2. Immediately after the pole-at-zero guard block (the `1/sinh` check),
   before `try { const antiderivative = indefiniteIntegral(...) }`:

```typescript
  assertInverseHyperbolicIntegralDomain(exprAlgebrite, variable, lower, upper);
```

3. Commit and force-push:

```bash
git add src/engine/stepEngine/calculus.ts src/engine/stepEngine/itHiDomainGuards.ts
git commit -m "fix(calculus): wire IT-HI interval domain guards for acosh/atanh/arcoth"
git push --force-with-lease origin qa/syntax-audit-in625-a1
```

## Guard behavior

| Integrand | Reject when |
|-----------|-------------|
| `acosh(x)` | `min(lower,upper) < 1` |
| `atanh(x)` | `min <= -1` or `max >= 1` |
| `atanh(1/x)` (arcoth) | interval intersects `[-1, 1]` |

## Tests

`tests/trigonometryItHiDomain.audit.test.ts` (present at `b6d0d4d`).

```bash
npx vitest run tests/trigonometryItHiDomain.audit.test.ts
```
