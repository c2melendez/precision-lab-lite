# IT-HI interval domain guards — recovery

## Problem

Commits after `b6d0d4d` accidentally truncated `src/engine/stepEngine/calculus.ts`
(tool payload limit when rewriting the full ~43KB file). HEAD no longer
contains a usable calculus module.

## Recovery (required before CI)

```bash
git fetch origin
git checkout qa/syntax-audit-in625-a1
git reset --hard b6d0d4dc9f3fee0b3169c91c32ae2b0828436199
```

That commit already has:
- intact `calculus.ts`
- `tests/trigonometryItHiDomain.audit.test.ts`

Then apply the domain-guard insertion below (after the pole-at-zero block in
`calcDefiniteIntegral`), commit, and force-push:

```bash
git push --force-with-lease origin qa/syntax-audit-in625-a1
```

## Patch to insert (after the `1/sinh` pole-at-zero guard closing brace)

```typescript
  // IT-HI domain guards: the FTC is invalid outside the real domain of the
  // inverse-hyperbolic integrands. Reject before evaluating the primitive so
  // a formal antiderivative cannot hide a divergent improper integral.
  // - acosh: domain [1, +∞)
  // - atanh: domain (-1, 1)
  // - arcoth ≡ atanh(1/x): domain (-∞, -1) ∪ (1, +∞)
  if (/^[A-Za-z]$/.test(variable) && Number.isFinite(lower) && Number.isFinite(upper)) {
    let source = exprAlgebrite.replace(/\s+/g, '');
    while (source.startsWith('(') && source.endsWith(')')) {
      let depth = 0, closesAt = -1;
      for (let i = 0; i < source.length; i++) {
        if (source[i] === '(') depth++;
        if (source[i] === ')' && --depth === 0) { closesAt = i; break; }
      }
      if (closesAt !== source.length - 1) break;
      source = source.slice(1, -1);
    }
    const x = variable;
    const low = Math.min(lower, upper);
    const high = Math.max(lower, upper);
    if (source === `acosh(${x})`) {
      if (low < 1) {
        throw { code: ErrorCode.DOMAIN_ERROR, message: 'La integral de acosh sale del dominio real [1, +∞).' } as AppError;
      }
    }
    if (source === `atanh(${x})`) {
      if (low <= -1 || high >= 1) {
        throw { code: ErrorCode.DOMAIN_ERROR, message: 'La integral de atanh sale del dominio real (-1, 1).' } as AppError;
      }
    }
    if (source === `atanh(1/(${x}))` || source === `(atanh(1/(${x})))`) {
      if (low <= 1 && high >= -1) {
        throw { code: ErrorCode.DOMAIN_ERROR, message: 'La integral de arcoth sale del dominio real |x| > 1.' } as AppError;
      }
    }
  }
```

## Local reference

A complete patched tree was prepared at local commit `2d54609` (not pushed):
`fix(calculus): add IT-HI interval domain guards for acosh/atanh/arcoth`.

## Tests already on branch (at b6d0d4d)

`tests/trigonometryItHiDomain.audit.test.ts` — rejects out-of-domain intervals
and accepts interior intervals for acosh / atanh / arcoth.
