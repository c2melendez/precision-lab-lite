# Actualización de certificación — 2026-11-06 UTC (r415)

## Dependencias de auditoría Lite — r414

- El gate `QA dependency audit (hard gate)` de CI fallaba desde commits anteriores por 4 vulnerabilidades moderadas: `vite-plugin-pwa` 1.3.0 → `workbox-build` → `glob`/`minimatch`.
- Subir `vite-plugin-pwa` a 2.0.0 no corrige la cadena, porque `workbox-build` 7.4.1 mantiene `glob` 11.1.0 y `minimatch` afectados. Se fijaron `overrides` `glob ^14.0.4` y `minimatch ^11.0.5`, y `vite-plugin-pwa` queda en 1.3.0.
- Lite SHA técnico `e2007be51f848a33e0b9881dff3c6a2689991672`: CI `42194172999` SUCCESS (incluye tests unitarios y build), Cumulative `42194172938` SUCCESS, H1d `42194172980` SUCCESS, Scientific UI `42194172930` SUCCESS, Runner `42194172934` SUCCESS, dependency/security gates `42194172973` SUCCESS.
- Auditoría: 0 vulnerabilidades (antes 4 moderadas). Typecheck y build de producción con `sw.js` generado: OK.
- Riesgo registrado, no bloqueo: 4 pruebas pesadas de álgebra (AS-FAC-08/09, AS-B-06/18) exceden el timeout de 5 s en entorno local, igual que en el HEAD previo. En CI del SHA `e2007be5` pasaron.

## Algebra229 AS-B-16 — PASS_SCOPED bilateral (r415)

- Tests presentes: Lite `tests/algebra229AsB16.audit.test.ts`; Plus `backend/tests/test_algebra229_as_b16.py`.
- Sin cambio de producto: ambos motores ya factorizan `a^3-b^3` como `(a-b)(a^2+ab+b^2)`.
- Evidencia de ejecución del focal: Lite `e2007be5` Cumulative `42194172938`, focal 2/2 PASS (vitest). Plus `481cb08` Cumulative `42159166321`, focal 2/2 PASS (pytest).
- Acceptance: `ALGEBRA229_AS_B_16_ACCEPTANCE_2026-11-06.md`.
- **Siguiente:** AS-B-17 `a^3+b^3` → `(a+b)(a^2-ab+b^2)`. Test presente en ambos motores y pasa localmente; falta evidencia CI del mismo SHA. Global **OPEN**.
