# Actualización de certificación — 2026-11-06 UTC (r439)

## Algebra229 AS-B-26 — WAIT (gates exact-SHA en curso)

**Contrato:** `factorizar el entero 360` → `2^{3}\\cdot 3^{2}\\cdot 5` (N2). Los tests bilaterales ya están reforzados con fila fuente exacta, forma ASCII y oráculo independiente por división de prueba.

### Estado de ejecución bilateral
- Cumulative [42270957296](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957296) SUCCESS; focal `algebra229AsB26.audit.test.ts` 4/4 y 2,264 passed.
- H1d [42270957306](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957306) SUCCESS; 22/22 Playwright.
- CI [42270957315](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957315) SUCCESS; typecheck, unit/parity y production build.
- Scientific UI [42270957389](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957389) IN_PROGRESS; job 128075078138, verificación nativa desktop/tablet/mobile.
- Runner [42270957317](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957317) SUCCESS; fingerprint push-only.
- Lite SHA técnico: `26cc8cc69d32e4a5614dc9921a87030308f9cdd1`.
- Plus SHA técnico corregido: `ef97ca2a23324d2512f4f26585ad51f421d316ff`.
- La corrida Plus sobre SHA `be31d726bdc0104a9f07fc5479a3325abd0c6f0d` es anterior a la corrección de escapes LaTeX como raw strings; no se acredita ni se reutiliza.

### Decisión
Estado **WAIT**: no relanzar gates equivalentes mientras estén activos. No hay evidencia suficiente para aceptación bilateral hasta que Lite Scientific UI y Plus Cumulative/CI completen, y se revisen los logs focales del SHA Plus corregido. Sin cambios de motor/producto; solo tests. Certificación global **OPEN**.

**Siguiente:** cerrar/aceptar AS-B-26 solo con esos resultados; después avanzar a AS-B-27 (`factorizar 1001` → `7·11·13`).

---

# Actualización de certificación — 2026-11-06 UTC (r438)

## Algebra229 AS-B-25 — PASS_SCOPED bilateral (r438)

**Contrato D22:** `factor(x^2+1) sobre ℂ` → `(x-i)*(x+i)` únicamente con el sufijo explícito. Sin sufijo, no se introduce `i`.

### Lite — SHA técnico `dbea0c0e5aea6701d327d82ebedb8507fea7bb33`
- Cumulative [42224254086](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254086) SUCCESS; focal 5/5, 366/366 archivos, 2,263 passed, 8 expected fail y 34 TODO; guard `skip=false`, sin REUSE.
- CI [42224254124](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254124) SUCCESS; focal 5/5, 366/366 archivos, npm audit sin vulnerabilidades.
- H1d [42224254222](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254222) SUCCESS; 22/22 Playwright.
- Scientific UI [42224254152](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254152) SUCCESS; 456/456 Playwright desktop/tablet/mobile.
- Runner [42224254110](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254110) SUCCESS; solo continuidad/fingerprint.

### Plus — SHA técnico `1da7ecac06ab65c7d377af33ee88479ef6218e9a`
- Cumulative [42224279552](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279552) SUCCESS; frontend/backend SUCCESS, focal 4/4, backend 2,804 passed, 1 skipped y 10 xfailed; guard `skip=false`, sin REUSE.
- CI [42224279542](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279542) SUCCESS; frontend/backend SUCCESS, backend 2,804 passed, 1 skipped y 10 xfailed.
- H1d [42224279507](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279507) SUCCESS; 38/38 Playwright.
- Runner [42224279695](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279695) SUCCESS.

### Decisión
Los logs revisados confirman ejecución de las pruebas, no REUSE. Los cambios técnicos de ambos productos se limitaron a sus tests focales; no se modificó motor ni producto. Acceptance bilateral: `ALGEBRA229_AS_B_25_ACCEPTANCE_2026-11-06.md`. La certificación global permanece **OPEN**; SG28/H2/DIST, SECURITY-S25 y los gaps independientes siguen abiertos.

**Siguiente:** AS-B-26 `\\text{factorizar el entero }360` → `2^{3}\\cdot 3^{2}\\cdot 5` (N2). Global **OPEN**.

---

# Actualización de certificación — 2026-11-06 UTC (r437)

## Algebra229 AS-B-25 — IN_PROGRESS

**Contrato (D22):** `factor(x^2+1) sobre ℂ` → `(x-i)*(x+i)` solo con el sufijo complejo explícito. La entrada `factor(x^2+1)` sin sufijo no cambia ni debe introducir `i`. No es soporte general de factorización compleja.

### Lite — SHA técnico `dbea0c0e5aea6701d327d82ebedb8507fea7bb33`
- Test `tests/algebra229AsB25.audit.test.ts`: 5/5 PASS en acumulativo y CI; siete celdas semánticas exactas de la fila congelada, resultado ASCII, equivalencia simbólica, oráculo independiente de multiplicación compleja en ocho muestras enteras y regresión de entrada sin sufijo.
- Cumulative [42224254086](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254086) SUCCESS; job 127913631923; 366/366 archivos.
- CI [42224254124](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254124) SUCCESS; job 127913631707; 366/366 archivos; focal 5/5.
- H1d [42224254222](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254222) SUCCESS; job 127913632237; 22/22 Playwright.
- Scientific UI [42224254152](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254152) IN_PROGRESS; job 127913632048 dentro de `Install Chromium`.
- Runner [42224254110](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254110) SUCCESS, push-only.

### Plus — SHA técnico `1da7ecac06ab65c7d377af33ee88479ef6218e9a`
- Test `backend/tests/test_algebra229_as_b25.py`: 4 pruebas; fila fuente, HTTP exacto, equivalencia simbólica, AST complejo independiente para ocho muestras enteras y regresión de la entrada sin sufijo.
- H1d [42224279507](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279507) SUCCESS; job 127913716294; 38/38 Playwright.
- Cumulative [42224279552](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279552) IN_PROGRESS; frontend SUCCESS, backend job 127913716240 ejecutando regresión.
- CI [42224279542](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279542) IN_PROGRESS; frontend SUCCESS, backend job 127913716574 ejecutando tests.
- Runner [42224279695](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279695) SUCCESS.

### Decisión
Los logs Lite confirman que `tests/algebra229AsB25.audit.test.ts` ejecutó las cinco pruebas y que los 366 archivos pasaron. H1d está confirmado en ambos motores. B25 sigue IN_PROGRESS hasta Scientific UI Lite y los backends acumulativo/CI Plus. No modificar motor/producto mientras las pruebas pasan. No relanzar los gates ya activos.

**Baseline aceptado:** AS-B-24 PASS_SCOPED. La certificación global permanece **OPEN**.

---
# Actualización de certificación — 2026-11-06 UTC (r436)

## Algebra229 AS-B-24 — PASS_SCOPED bilateral

**Contrato:** `factor(x^2-2) sobre ℝ` → `(x-sqrt(2))*(x+sqrt(2))` (N3). Se conserva la distinción con AS-B-23: sobre ℚ, `x^2-2` permanece irreducible.

### Lite — SHA técnico `2342cbd5ac2de6e9a7b1fbf42ddb9df4ee1f9c8d`
- Test `tests/algebra229AsB24.audit.test.ts`: 4/4 PASS; fija la fila congelada, salida ASCII, equivalencia simbólica y oráculo numérico independiente en diez muestras enteras.
- Cumulative [42222060038](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060038) SUCCESS; job 127906275669, 366/366 archivos, test focal 4/4.
- CI [42222060154](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060154) SUCCESS; job 127906274051, test focal 4/4, 366/366 archivos.
- Scientific UI [42222060025](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060025) SUCCESS; job 127906273503, 456/456 Playwright desktop/tablet/mobile.
- H1d [42222060032](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060032) SUCCESS; job 127906273506, 22/22 Playwright en desktop Chromium.
- Runner [42222059941](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222059941) SUCCESS, fingerprint push-only.

### Plus — SHA técnico `5d8d78f8e35d02830bfbce63c107fe5990904cd1`
- Test `backend/tests/test_algebra229_as_b24.py`: 3/3 PASS; fila congelada, endpoint HTTP `POST /api/v1/factor`, forma ASCII, equivalencia SymPy y oráculo AST independiente en diez muestras enteras.
- Cumulative [42221909462](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909462) SUCCESS; frontend/backend SUCCESS; focal 3/3; backend 2,803 passed, 1 skipped, 10 xfailed.
- H1d [42221909235](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909235) SUCCESS, 38/38 Playwright.
- CI [42221909164](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909164) SUCCESS; frontend/backend SUCCESS; backend 2,803 passed, 1 skipped, 10 xfailed.
- Runner [42221910347](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221910347) SUCCESS, fingerprint push-only.

### Alcance y decisión
Los logs de los SHA finales muestran ejecución focal real (no REUSE). Solo cambiaron los tests de certificación; no hubo modificación de motores ni producto. Los intentos intermedios corrigieron discrepancias del propio test al reflejar exactamente los delimitadores y escapes LaTeX del fixture; no constituyeron fallos de la matemática ni del motor.

**Resultado: PASS_SCOPED bilateral.** La certificación global permanece **OPEN**. SG28/H2/DIST, SECURITY-S25 y los demás capability gaps no relacionados permanecen sin cambio.

**Siguiente:** AS-B-25, `factor(x^2+1) sobre ℂ` → `(x-i)*(x+i)`, solo con sufijo complejo explícito; sin ese sufijo, no introducir `i`.

---

# Actualización de certificación — 2026-11-06 UTC (r435)

## Algebra229 AS-B-24 — IN_PROGRESS (B24 sin aceptación bilateral todavía)

**Contrato:** `factor(x^2-2) sobre ℝ` → `(x-sqrt(2))*(x+sqrt(2))` (N3). Se mantiene la distinción con AS-B-23, donde `x^2-2` permanece irreducible sobre ℚ.

### Lite — SHA técnico `2342cbd5ac2de6e9a7b1fbf42ddb9df4ee1f9c8d`
- Test `tests/algebra229AsB24.audit.test.ts`: 4/4 PASS en acumulativo y CI. Verifica las siete celdas semánticas exactas (seis valores y delimitador final), forma ASCII, equivalencia simbólica y oráculo numérico independiente en diez muestras enteras.
- Cumulative [42222060038](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060038) SUCCESS; job 127906275669, 366/366 archivos, test focal 4/4.
- CI [42222060154](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060154) SUCCESS; job 127906274051, test focal 4/4 y 366 archivos.
- Scientific UI [42222060025](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060025) SUCCESS; job 127906273503, 456/456 Playwright desktop/tablet/mobile.
- H1d [42222060032](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060032) **IN_PROGRESS**; job 127906273506 está detenido dentro del paso `Install Chromium` (`npx playwright install --with-deps chromium`). El paso `Run IN625 H1d reentry` sigue PENDING; no hay resultado Playwright H1d todavía.
- Runner [42222059941](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222059941) SUCCESS, fingerprint push-only; no despachó otro gate.

### Plus — SHA técnico `5d8d78f8e35d02830bfbce63c107fe5990904cd1`
- Test `backend/tests/test_algebra229_as_b24.py`: 3/3 PASS; fila fuente exacta, endpoint HTTP `POST /api/v1/factor`, forma ASCII, equivalencia SymPy y oráculo AST independiente en diez muestras enteras.
- Cumulative [42221909462](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909462) SUCCESS; frontend/backend SUCCESS; focal 3/3; backend 2,803 passed, 1 skipped, 10 xfailed.
- H1d [42221909235](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909235) SUCCESS, 38/38 Playwright.
- CI [42221909164](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909164) SUCCESS; frontend/backend SUCCESS; backend 2,803 passed, 1 skipped, 10 xfailed.
- Runner [42221910347](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221910347) SUCCESS, fingerprint push-only.

### Diagnóstico del harness
Los intentos previos de B24 encontraron diferencias en el verificador del fixture (ocho posiciones al dividir la fila, notación LaTeX literal y `\sqrt{2}` con llaves); se corrigieron siguiendo la fila congelada. No se modificó motor, producto, oráculo matemático ni criterios de aceptación. Solo se tocaron los tests focales. La evidencia aceptada para Lite/Plus es exclusivamente la de los SHA técnicos finales señalados arriba.

**Siguiente acción:** esperar el H1d Lite ya activo, sin volver a despacharlo. B24 no se marca PASS_SCOPED hasta que ese job finalice correctamente. La certificación global permanece **OPEN**.

---

# Actualización de certificación — 2026-11-06 UTC (r434)

## Algebra229 AS-B-23 — PASS_SCOPED bilateral (r434)

- Lite HEAD técnico `f99fff6c06d7950ff14a8711e88035f9c7afd881`: Cumulative 42218347585 SUCCESS (focal 3/3 PASS; 366 archivos, 2,261 passed, 8 expected fail y 34 TODO); H1d 42218347590 SUCCESS (22/22); Scientific UI 42218347639 SUCCESS (456/456 desktop/tablet/mobile); CI 42218347555 SUCCESS; Runner 42218347616 SUCCESS, solo fingerprint de push.
- Plus HEAD técnico `120184413febf16d6471ee0b72a30cabe467fa0c`: Cumulative 42218368185 SUCCESS (frontend/backend SUCCESS; focal 3/3 PASS; backend 2,802 passed, 1 skipped y 10 xfailed); H1d 42218368203 SUCCESS (38/38); CI 42218368283 SUCCESS (frontend/backend SUCCESS); Runner 42218368207 SUCCESS, solo fingerprint de push.
- Acceptance bilateral: `ALGEBRA229_AS_B_23_ACCEPTANCE_2026-11-06.md`. Solo se reforzaron tests; no hubo cambios de motor/producto.
- **Siguiente:** AS-B-24 `factor(x^2-2) sobre ℝ` → `(x-sqrt(2))*(x+sqrt(2))` (N3, se permiten raíces reales). Global **OPEN**.

---

# Actualización de certificación — 2026-11-06 UTC (r433)

## Algebra229 AS-B-22 — PASS_SCOPED bilateral (r433)

- Lite HEAD técnico `b385d88845d9f1e257cbce03295c73273cf4446b`: Cumulative 42211290550 SUCCESS (focal 3/3 PASS; 366 archivos, 2,260 passed, 8 expected fail, 34 TODO); H1d 42211290765 SUCCESS (22/22); Scientific UI 42211290551 SUCCESS (456/456 desktop/tablet/mobile); CI 42211290654 SUCCESS. Runner 42211290975 SUCCESS, solo fingerprint de push.
- Plus HEAD técnico `c2bc727e04d12867bfff1b718c072fe735cf1003`: Cumulative 42211299152 SUCCESS (frontend y backend; focal 3/3 PASS; backend 2,801 passed, 1 skipped, 10 xfailed); H1d 42211299254 SUCCESS (38/38); CI 42211299150 SUCCESS. Runner 42211299262 SUCCESS, solo fingerprint de push.
- En los seis jobs de gates aplicables: guard `skip=false`, `evidence_run_id=""`; pruebas ejecutadas realmente en el SHA de este caso, sin REUSE.
- Acceptance bilateral: `ALGEBRA229_AS_B_22_ACCEPTANCE_2026-11-06.md`. Solo se reforzaron tests; ningún cambio de producto/motor.
- **Siguiente:** AS-B-23 `x^{2}-2` → `x^{2} - 2` (N2, irreducible sobre ℚ: debe quedar igual). Global **OPEN**.

**Reconciliación documental:** Lite mantenía índice/CURRENT_STATE r420 mientras su EXECUTION_LOG ya tenía r432; se sincronizan ambos productos a r433. La certificación global y los gaps externos no cambian.

---

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


