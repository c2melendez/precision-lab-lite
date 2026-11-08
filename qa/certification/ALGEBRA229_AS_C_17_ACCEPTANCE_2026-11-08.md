# ALGEBRA229 AS-C-17 — Aceptación bilateral (2026-11-08)

- Estado: PASS bilateral. Baseline `ALGEBRA229-AS-C-17 PASS`.
- Fila congelada: `valor` `\gcd\left(x^{2}-1,\ x^{2}-2x+1\right)` → `x - 1`.
- SHA técnico final (precision-lab-lite): `0aa5e5db33b2d22851e36752c2656a88259445e5`.
- Evidencia: CI 42489843656, Cumulative 42489843613, H1d 42489843584, Scientific UI 42489843630, Runner 42489843631. Todos SUCCESS; sin REUSE.
- Verificación: `polynomialGcd` / `evaluate(gcd(...))` equivalentes a `x-1`, raíz compartida x=1, `x+1` no divisor común.
- Nota: Sin cambios de producto. Test-first únicamente.
