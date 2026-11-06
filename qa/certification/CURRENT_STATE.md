# Actualización de certificación — 2026-11-06 UTC (r420)

## Algebra229 AS-B-21 — PASS_SCOPED bilateral (r420)

- Lite HEAD técnico `4ab22e5565255bc0d0a451dfae3debf24f8521fa` (test reforzado): Cumulative 42209065420 con focal 3/3 PASS; H1d 42209065464, Scientific UI 42209065501, Runner 42209065402 y CI 42209065433 SUCCESS.
- Plus HEAD técnico `768c7539650c91ffb1f51e85ff292aabd8e9a6a6` (test reforzado): Cumulative 42209061963 con focal 2/2 PASS; H1d 42209061958, CI 42209062038 y Runner 42209061955 SUCCESS.
- Acceptance: `ALGEBRA229_AS_B_21_ACCEPTANCE_2026-11-06.md`. Sin cambio de producto.
- **Siguiente:** AS-B-22 `x^{2}+1` → `x^{2} + 1` (N1, irreducible sobre ℚ y ℝ: debe quedar igual). Global **OPEN**.

---

# Actualización de certificación — 2026-11-06 UTC (r419)

## Algebra229 AS-B-20 — PASS_SCOPED bilateral (r419)

- Lite HEAD técnico `b92f75b9121462bb4e720f554a6b440ea5fef64b` (test reforzado): Cumulative 42206950541 con focal 3/3 PASS; H1d 42206950644, Scientific UI 42206950607, Runner 42206950545 y CI 42206950542 SUCCESS.
- Plus HEAD técnico `fecbf483992095a937f680a1ddab8807b065f166` (test reforzado): Cumulative 42206944853 con focal 2/2 PASS; H1d 42206944896, CI 42206944888 y Runner 42206944815 SUCCESS.
- Acceptance: `ALGEBRA229_AS_B_20_ACCEPTANCE_2026-11-06.md`. Sin cambio de producto.
- **Siguiente:** AS-B-21 `(x^{2}+1)^{2}-4x^{2}` → `(x - 1)^{2} (x + 1)^{2}`. Global **OPEN**.

---

# Actualización de certificación — 2026-11-06 UTC (r418)

## Algebra229 AS-B-19 — PASS_SCOPED bilateral (r418)

- Lite HEAD técnico `7cec57d31bdc78ce5ba0d48c1f7a6f42d7608977` (test reforzado): Cumulative 42202183460 con focal 2/2 PASS; H1d 42202183400, Scientific UI 42202183396, Runner 42202183405 y CI 42202183478 SUCCESS.
- Plus HEAD técnico `f5109b537005943738ad9797908bef340d23a5b6` (test reforzado): Cumulative 42202185841 con focal 2/2 PASS; H1d 42202185915, CI 42202185876 y Runner 42202185863 SUCCESS.
- Acceptance: `ALGEBRA229_AS_B_19_ACCEPTANCE_2026-11-06.md`. Sin cambio de producto.
- **Siguiente:** AS-B-20 `x^{4}+x^{2}y^{2}+y^{4}` → `(x^2 - x y + y^2)(x^2 + x y + y^2)`. Global **OPEN**.

---

# Actualización de certificación — 2026-11-06 UTC (r417)

## Algebra229 AS-B-18 — PASS_SCOPED bilateral (r417)

- Lite HEAD técnico `bb159a449f2d320d607b65503310bb8741cf16b2` (test reforzado): Cumulative 42199356489 con focal 2/2 PASS; H1d 42199356467, Scientific UI 42199356498, Runner 42199356546 y CI 42199356505 SUCCESS.
- Plus HEAD técnico `1fab6d5507822c922288c63ba9454f7536d3aead`: Cumulative 42199349315 con focal 2/2 PASS; H1d 42199349400, CI 42199349335 y Runner 42199349956 SUCCESS.
- Acceptance: `ALGEBRA229_AS_B_18_ACCEPTANCE_2026-11-06.md`. Sin cambio de producto.
- **Siguiente:** AS-B-19 `x^{2}y-xy^{2}` → `x y \left(x - y\right)`. Global **OPEN**.

---

## Algebra229 AS-B-17 — PASS_SCOPED bilateral (r416)

- Plus HEAD técnico `5d3df39fbfb19bc209b47f5f5bedb02a7212c19a` (test reforzado): Cumulative 42197922106 con focal 2/2 PASS; H1d 42197922135, CI 42197922387 y Runner 42197922120 SUCCESS.
- Lite HEAD técnico `47b381c81f899dd9f5e3a073b4de6cd726ccda1c` (test reforzado): Cumulative 42197934523 con focal 2/2 PASS; H1d 42197934472, Scientific UI 42197934467, Runner 42197934461 y CI 42197934400 SUCCESS.
- Acceptance: `ALGEBRA229_AS_B_17_ACCEPTANCE_2026-11-06.md`. Sin cambio de producto.
- **Siguiente:** AS-B-18 `x^8-1` → `(x-1)(x+1)(x^2+1)(x^4+1)`. Global **OPEN**.

---

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


