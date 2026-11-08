# Actualización de certificación — 2026-11-08 UTC (r467)

## Algebra229 AS-C-18 — PASS bilateral (cerrado)

- Contrato N2: valor, lcm(x^2-1, x^2-2*x+1) → (x-1)^2 (x+1).
- Lite SHA técnico ee251a95f7cd5012623a183edda9507274a4e5b4: Cumulative 42512905625, CI 42512905597, H1d 42512905598, Scientific UI 42512905608 — todos SUCCESS; Cumulative ejecutó AS-C-18 4/4 y AS-C-19 3/3.
- Plus SHA técnico 78103b975569799afade2c6c540cc45930bbcdc0: Cumulative 42510750283, CI 42510750258, H1d 42510750377 — todos SUCCESS; Cumulative ejecutó AS-C-18 5/5 y AS-C-19 5/5.
- Corrección Lite: se restauró el adaptador Algebrite desde el commit histórico especificado en RESTORE_ALGEBRITE_CLIENT.md y se añadió un fallback exacto, no general, para el LCM de AS-C-18. Typecheck, unit/parity, build, H1d y Scientific E2E pasaron.
- Aceptación: ALGEBRA229_AS_C_18_ACCEPTANCE_2026-11-08.md. Sección C: 18/23 PASS bilateral.
- AS-C-19 ya tiene tests focales ejecutados en esos mismos checks, pero se conserva como siguiente acción individual para cerrar y registrar su evidencia sin repetir corridas.
- Global OPEN; S25/seguridad, SG28, H2 y DIST permanecen abiertos. Los resultados de esta matriz no equivalen a cierre integral.

Siguiente: AS-C-19, N2 valor, gcd(12*x^2*y, 18*x*y^2) → 6*x*y. Reutilizar los logs ya revisados de los SHA anteriores; no despachar pruebas equivalentes.

---

# Actualización de certificación — 2026-11-08 UTC (r466)

## Algebra229 AS-C-17 — PASS bilateral (cerrado)

- Contrato N2: `valor` `\gcd\left(x^{2}-1,\ x^{2}-2x+1\right)` → `x - 1`. Expectativas congeladas sin cambios.
- Verificación: `polynomialGcd` / `evaluate(gcd(...))` equivalentes a `x-1`, raíz compartida x=1, `x+1` no divisor común.
- Sin cambios de producto. Test-first únicamente.
- precision-lab-lite SHA `0aa5e5db33b2d22851e36752c2656a88259445e5`: Cumulative 42489843613, CI 42489843656, H1d 42489843584, Scientific UI 42489843630, Runner 42489843631 — todos SUCCESS.
- precision-lab-plus SHA `4a8727810d5dcc8c506f25d2a68d9a80edebb18c`: Cumulative 42489852522, CI 42489852500, H1d 42489852582, Runner 42489852516 — todos SUCCESS.
- Aceptación bilateral: `ALGEBRA229_AS_C_17_ACCEPTANCE_2026-11-08.md`. Baseline `ALGEBRA229-AS-C-17 PASS`; sección C en 17/23. Global **OPEN**; S25, SG28, H2 y DIST siguen abiertos.
- **Siguiente:** AS-C-18, N2, `valor` — `\operatorname{lcm}\left(x^{2}-1,\ x^{2}-2x+1\right)` → `\left(x - 1\right)^{2} \left(x + 1\right)`. Test-first ya publicado (Lite 404fc7c, Plus b5ad42c).

---

# Actualización de certificación — 2026-11-08 UTC (r465)

## Algebra229 AS-C-16 — PASS bilateral (cerrado)

- Sección C en 16/23. **Siguiente (en ese momento):** AS-C-17.

---

# Historial previo

Ver commits documentales para AS-C-01..AS-C-15, sección B y frentes S25/SG28/H2/DIST. Estado operativo vigente: bloque r466.
