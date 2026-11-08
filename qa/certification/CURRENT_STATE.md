# Actualización de certificación - 2026-11-08 UTC (r456)

## Algebra229 AS-C-07 - PASS bilateral (cerrado)

- Contrato N2: `simplificar` `\frac{1}{x-1}-\frac{1}{x+1}` → `\frac{2}{\left(x - 1\right) \left(x + 1\right)}`, sin nota de dominio en la fila congelada.
- Test-first en verde sin cambios de producto. Ambos motores devuelven `2/(x^2-1)`: representación equivalente a la celda congelada, verificada con diferencia exacta `0` y oráculo independiente; no se exige igualdad textual entre formas equivalentes.
- Plus SHA `7c61d94bf58342944bd163bafc08443c9cd364c5`: Cumulative 42450284227 SUCCESS (focal 4/4), CI 42450284226 SUCCESS (2,840 passed, 1 skipped, 10 xfailed; 88.88%), H1d 42450284220 SUCCESS (38/38), Runner 42450284255 SUCCESS.
- Lite SHA `2c807c5433de932e544a2c21ec702f7924a1ed22`: Cumulative 42450296439 SUCCESS (focal 4/4; 374 archivos, 2,305 passed, 8 expected fail, 34 TODO), CI 42450296465 SUCCESS, H1d 42450296447 SUCCESS (22/22), Scientific UI 42450296494 SUCCESS (456/456), Runner 42450296577 SUCCESS.
- Guards revisados: `skip=false`, `evidence_run_id` vacío y sin REUSE.
- Aceptación bilateral: `ALGEBRA229_AS_C_07_ACCEPTANCE_2026-11-08.md`. Baseline `ALGEBRA229-AS-C-07 PASS`; sección C en 7/23. Global **OPEN**; S25, SG28, H2 y DIST siguen abiertos.
- **Siguiente:** AS-C-08, N2, `simplificar` - `\frac{x+1}{x^{2}-1}-\frac{1}{x-1}` → `0`, sin nota de dominio en la fila congelada.
# Actualización de certificación - 2026-11-08 UTC (r455)

## Algebra229 AS-C-06 - PASS bilateral (cerrado)

- Contrato N2: `simplificar` `\frac{\frac{1}{x}-\frac{1}{y}}{x-y}` → `- \frac{1}{x y}`, sin nota de dominio en la fila congelada.
- Gap real de capability en Lite: `simplify()` devolvía `(1/x-1/y)/(x-y)`. Se añadió `factoredCancellation` en `src/engine/algebriteClient.ts` (rationalize + factor de numerador/denominador + simplify, aceptando solo una fracción única con denominador producto). Plus ya cumplía con SymPy.
- Lite SHA `12cab2e2e536d313635256f280ce0951a73afebd`: Cumulative 42449459397 SUCCESS (focal 5/5; 373 archivos, 2,301 passed, 8 expected fail, 34 TODO), CI 42449459368 SUCCESS, H1d 42449459386 SUCCESS (22/22), Scientific UI 42449459435 SUCCESS (456/456), Runner 42449459424 SUCCESS.
- Plus SHA `9ddc8205ec97a13bed7857a1487024a2650e1e78`: Cumulative 42403960553 SUCCESS (focal 4/4), CI 42403960642 SUCCESS (2,836 passed, 1 skipped, 10 xfailed; cobertura 88.89%), H1d 42403960552 SUCCESS (38/38), Runner 42403960657 SUCCESS.
- Guards revisados: `skip=false`, `evidence_run_id` vacío y sin REUSE. Suite completa Lite 373/373 archivos verificada localmente; sin regresiones en C-02..C-05.
- Aceptación bilateral: `ALGEBRA229_AS_C_06_ACCEPTANCE_2026-11-07.md`. Baseline `ALGEBRA229-AS-C-06 PASS`; sección C en 6/23. Global **OPEN**; S25, SG28, H2 y DIST siguen abiertos.
- **Siguiente:** AS-C-07, N2, `simplificar` - `\frac{1}{x-1}-\frac{1}{x+1}` → `\frac{2}{\left(x - 1\right) \left(x + 1\right)}`, sin nota de dominio en la fila congelada.

# Actualización de certificación - 2026-11-08 UTC (r454)

## Algebra229 AS-C-05 - PASS bilateral (cerrado)

- Contrato N1: `simplificar` `\frac{1}{x}+\frac{1}{y}` → `\frac{x + y}{x y}`, con nota "Suma de fracciones con denominador común".
- Gap de capability en Lite: `simplify()` dejaba la suma sin combinar. Se añadió `combinedSingleFraction` (`rationalize()` acotado a una fracción única con denominador producto). Plus ya cumplía con SymPy.
- Plus SHA `310b7ceaa89c3c309443ae6865263b67bf95373d`: Cumulative 42346703999 SUCCESS (focal 4/4), CI 42346704029 SUCCESS (2,832 passed, 1 skipped, 10 xfailed; 88.89%), H1d 42346704039 SUCCESS (38/38), Runner 42346704001 SUCCESS.
- Lite SHA `6e83392473bbaebe738ed493d73279f7c595cbfb`: Cumulative 42347259419 SUCCESS (focal 5/5; 372 archivos, 2,296 passed, 8 expected fail, 34 TODO), CI 42347259190 SUCCESS (focal 5/5), H1d 42347259257 SUCCESS (22/22), Scientific UI 42347259155 SUCCESS, Runner 42347259168 SUCCESS.
- Aceptación bilateral: `ALGEBRA229_AS_C_05_ACCEPTANCE_2026-11-07.md`. Baseline `ALGEBRA229-AS-C-05 PASS`; reconciliación documental: `continuity.json` estaba en r451/C-02 mientras CURRENT_STATE ya tenía r453/C-04; se sincroniza a r455/C-06.
- **Siguiente (en ese momento):** AS-C-06, N2, `simplificar` - `\frac{\frac{1}{x}-\frac{1}{y}}{x-y}` → `- \frac{1}{x y}`.
# Actualización de certificación — 2026-11-07 UTC (r453)

## Algebra229 AS-C-04 — PASS bilateral (cerrado)

- Contrato N2: `simplificar` `\frac{x^{2}-4}{x^{2}+4x+4}\cdot\frac{x+2}{x-2}` → `1`, sin nota de dominio en la fila congelada. Expectativas congeladas sin cambios.
- Test-first: fila congelada, resultado exacto, equivalencia simbólica, muestras fuera de x=-2 y x=2, y control de `DOMAIN_ERROR` en x=-2 y x=2. Ambos motores ya cumplían sin cambios de producto.
- precision-lab-lite SHA `4ef338d`: focal AS-C-04 5/5; 371 archivos, 2,291 passed, 8 expected fail, 34 TODO. Runs: CI 42345867487, Cumulative 42345867424, H1d 42345867402, Scientific UI 42345867469, Runner 42345867428, todos SUCCESS.
- Guards revisados: `skip=false` y `evidence_run_id` vacío; sin REUSE.
- Aceptación bilateral: `ALGEBRA229_AS_C_04_ACCEPTANCE_2026-11-07.md`. Baseline `ALGEBRA229-AS-C-04 PASS`; sección C en 4/23. Global **OPEN**; S25, SG28, H2 y DIST siguen abiertos.
- **Siguiente:** AS-C-05, N1, `simplificar` — `\frac{1}{x}+\frac{1}{y}` → `\frac{x + y}{x y}`, suma de fracciones con denominador común.

---

# Actualización de certificación — 2026-11-07 UTC (r452)

## Algebra229 AS-C-03 — PASS bilateral (cerrado)

- Contrato N2: `simplificar` `\frac{x^{2}+3x+2}{x^{2}-x-2}` → `\frac{x + 2}{x - 2}`, sin nota de dominio en la fila congelada. Expectativas congeladas sin cambios.
- Test-first: tests de fila congelada, resultado exacto, equivalencia simbólica, muestras fuera de x=2 y x=-1, y control de `DOMAIN_ERROR` en x=2 y x=-1. Ambos motores ya cumplían sin cambios de producto.
- precision-lab-lite SHA `1c2f7d5`: focal AS-C-03 5/5; 370 archivos, 2,286 passed, 8 expected fail, 34 TODO. Runs: CI 42337677029, Cumulative 42337677166, H1d 42337676952, Scientific UI 42337676945, Runner 42337677013, todos SUCCESS.
- Guards revisados: `skip=false` y `evidence_run_id` vacío; sin REUSE.
- Aceptación bilateral: `ALGEBRA229_AS_C_03_ACCEPTANCE_2026-11-07.md`. Baseline `ALGEBRA229-AS-C-03 PASS`; sección C en 3/23. Global **OPEN**; S25, SG28, H2 y DIST siguen abiertos.
- **Siguiente:** AS-C-04, N2, `simplificar` — `\frac{x^{2}-4}{x^{2}+4x+4}\cdot\frac{x+2}{x-2}` → `1`.

---

# Actualización de certificación — 2026-11-07 UTC (r451)

## Algebra229 AS-C-02 — PASS bilateral (cerrado)

- Contrato N2: `simplificar` `\frac{x^{3}-1}{x^{2}-1}` → `\frac{x^{2} + x + 1}{x + 1}`, sin nota de dominio en la fila congelada. Expectativas congeladas sin cambios.
- Corrección de producto: Plus cancela factores racionales comunes tras `sympy.simplify` (`_cancel_common_factors`); Lite reintenta con `simplify(expand(...))` y acepta solo cero o resultado sin denominador.
- Ajuste de notación en el oráculo de Plus: el motor imprime potencias como `**`; la prueba normaliza `**` a `^` sin cambiar la expectativa matemática.
- Lite SHA `c9fe409310f287d25f231c07dfdf68fdb055ec1a`: Cumulative 42335763410 SUCCESS (focal AS-C-02 5/5; 368 archivos, 2,281 passed, 8 expected fail, 34 TODO), CI 42335763323 SUCCESS, H1d 42335763455 SUCCESS (22/22), Scientific UI 42335763346 SUCCESS, Runner 42335763341 SUCCESS.
- Guards revisados: `skip=false` y `evidence_run_id` vacío; sin REUSE.
- Aceptación bilateral: `ALGEBRA229_AS_C_02_ACCEPTANCE_2026-11-07.md`. Baseline `ALGEBRA229-AS-C-02 PASS`; sección C en 2/23. Global **OPEN**; S25, SG28, H2 y DIST siguen abiertos.
- **Siguiente:** AS-C-03, N2, `simplificar` — `\frac{x^{2}+3x+2}{x^{2}-x-2}` → `\frac{x + 2}{x - 2}`.

---

# Actualización de certificación - 2026-11-06 UTC (r450)

## Algebra229 AS-C-01 - PASS bilateral (cerrado; inicio de sección C)

- Contrato N1: `simplificar` `\frac{x^{2}-1}{x-1}` → `x + 1`, con nota de dominio `Válido para x\neq1`. Test-first en verde sin cambios de producto en ninguno de los dos motores.
- Lite SHA `bb4e86b52a43f3da6b09651692f1a5f167f84f38`: Cumulative 42331112760 SUCCESS (focal 5/5, 295 ms; 368 archivos, 2,276 passed, 8 expected fail, 34 TODO), H1d 42331112802 SUCCESS (22/22), Scientific UI 42331112826 SUCCESS, CI 42331112758 SUCCESS, Runner 42331112757 SUCCESS.
- Plus SHA `e5dd15712a6522edd1f5638c64964b8bca302956`: Cumulative 42331096760 SUCCESS (focal AS-C-01 5/5; backend y frontend), CI 42331096764 SUCCESS (2,816 passed, 1 skipped, 10 xfailed; cobertura 88.87%), H1d 42331096766 SUCCESS (38/38), Runner 42331096757 SUCCESS.
- Guards revisados: runs por push sin inputs de dispatch, `skip=false` y `evidence_run_id` vacío; sin REUSE. Los logs muestran los cinco casos focales ejecutados y aprobados en ambos repos.
- Aceptación bilateral: `ALGEBRA229_AS_C_01_ACCEPTANCE_2026-11-06.md`. Baseline `ALGEBRA229-AS-C-01 PASS`; sección C abierta (1/23). El gate de seguridad (S25) y SG28/H2/DIST siguen siendo frentes independientes abiertos; global **OPEN**.
- **Siguiente:** AS-C-02, N2, `simplificar` - `\frac{x^{3}-1}{x^{2}-1}` → `\frac{x^{2} + x + 1}{x + 1}`, sin nota de dominio en la fila congelada. Test-first bilateral con fila congelada, simplificación exacta, equivalencia simbólica fuera de las raíces excluidas y control de dominio en `x=1` y `x=-1`.
# Actualización de certificación — 2026-11-06 UTC (r449)

## Algebra229 AS-B-30 — PASS_SCOPED bilateral (cerrado; sección B completa)

- Gap de capability corregido: la entrada congelada `\text{¿es primo }1000000007?` devolvía `PARSE_ERROR`. Se añadió primalidad determinista de 64 bits en Lite (`src/engine/primality.ts`) y Plus (`backend/app/services/primality.py`), acotada a la forma LaTeX congelada y a `primo(n)`/`esprimo(n)`. Miller-Rabin con testigos 2..37, exacto para `n <= 2^64-1`; no es un intérprete general de lenguaje natural.
- Lite SHA `99bbc9bc17b79d00c45299415b5f9d63a9d09c36`: Cumulative 42329909267 SUCCESS (focal 4/4; 367 archivos, 2,271 passed, 8 expected fail, 34 TODO), H1d 42329909190 SUCCESS (22/22), Scientific UI 42329909206 SUCCESS (456/456), CI 42329909188 SUCCESS, Runner 42329909192 SUCCESS.
- Plus SHA `a831d31d5bc13193e470949eb8efb06cc4527533`: Cumulative 42329897688 SUCCESS (focal 3/3), CI 42329897714 SUCCESS (2,811 passed, 1 skipped, 10 xfailed; 88.89%), H1d 42329897684 SUCCESS (38/38), Runner 42329897649 SUCCESS.
- Guards revisados: `skip=false` y `evidence_run_id` vacío en Cumulative/H1d de ambos repos; sin REUSE.
- Aceptación bilateral: `ALGEBRA229_AS_B_30_ACCEPTANCE_2026-11-06.md`. Baseline `ALGEBRA229-AS-B-30 PASS_SCOPED`; la sección B (AS-B-01..30) queda completa. El gate de seguridad (S25) y SG28/H2/DIST siguen siendo frentes independientes abiertos; global **OPEN**.
- **Siguiente:** AS-C-01, N1, `simplificar` — `\frac{x^{2}-1}{x-1}` → `x + 1`, válido para `x \neq 1`. Test-first bilateral: fila congelada, simplificación exacta, equivalencia simbólica fuera de `x=1` y control de dominio en `x=1`.

---
# Actualización de certificación — 2026-11-06 UTC (r448)

## Algebra229 AS-B-29 — PASS_SCOPED bilateral (cerrado)

- Evidencia verificada directamente en GitHub, no heredada del ledger: Lite SHA `1004174a0cd6ad29c9b252097f2664175c277918` con Cumulative 42292655779 SUCCESS (focal 4/4; 366 archivos, 2,267 passed, 8 expected fail, 34 TODO), CI 42292655724 SUCCESS, H1d 42292655725 SUCCESS (22/22), Scientific UI 42292655744 SUCCESS (456/456) y Runner 42292655803 SUCCESS.
- Plus SHA `534e5f208cb5986794f3c2aea8b3056fb9d30e7f` con Cumulative 42293287002 SUCCESS (focal B29 3/3; backend 2,808 passed, 1 skipped, 10 xfailed), CI 42293286925 SUCCESS (cobertura 88.88%), H1d 42293286948 SUCCESS (38/38) y Runner 42293287033 SUCCESS.
- Logs revisados: los guards de Cumulative/H1d registran `skip=false`, `evidence_run_id` vacío y "No reusable completed evidence found"; no hubo REUSE. El SHA previo `4fac5e5...` queda como diagnóstico test-only (`^` vs XOR), no como evidencia de aceptación.
- Aceptación bilateral: `ALGEBRA229_AS_B_29_ACCEPTANCE_2026-11-06.md`. Baseline `ALGEBRA229-AS-B-29 PASS_SCOPED`; certificación global **OPEN**.
- **Siguiente:** AS-B-30, N3, `valor` — `\text{¿es primo }1000000007?` → `sí, es primo`. Gap de capability confirmado en Plus HEAD: `POST /api/v1/evaluate` responde `PARSE_ERROR`. Implementar capacidad acotada de primalidad en Lite y Plus, con tests bilaterales (fila congelada, oráculo independiente por división de prueba y control compuesto), y ejecutar los gates en el SHA técnico nuevo.

---
# Actualización de certificación — 2026-11-06 UTC (r447)

## Algebra229 AS-B-29 — WAIT (solo Plus H1d pendiente)

- Contrato N2: factorizar 123456789 → 3^2*3607*3803. Tests bilaterales reforzados con fila congelada exacta, salida ASCII y oráculo independiente de primalidad, multiplicidades [2,1,1] y producto.
- Lite SHA `1004174a0cd6ad29c9b252097f2664175c277918`: Cumulative 42292655779 SUCCESS (focal 4/4; 2,267 passed); CI 42292655724 SUCCESS (focal 4/4); H1d 42292655725 SUCCESS (22/22); Scientific UI 42292655744 SUCCESS (456/456 desktop/tablet/mobile). Todos los gates Lite completados.
- Plus SHA corregido `534e5f208cb5986794f3c2aea8b3056fb9d30e7f`: Cumulative 42293287002 SUCCESS; focal B29 3/3 PASS; guard `skip=false`, `evidence_run_id` vacío; backend 2,808 passed, 1 skipped, 10 xfailed. Cumulative frontend/backend SUCCESS.
- Plus CI 42293286925 SUCCESS: backend 2,808 passed, 1 skipped, 10 xfailed; cobertura 88.88%; frontend/backend SUCCESS.
- Único gate pendiente: Plus H1d 42293286948 sigue IN_PROGRESS en `Install Chromium`; al cerrar debe verificarse el log de reentrada Playwright y el guard `skip=false` sin REUSE. No acreditar el SHA anterior `4fac5e5…`, cuyo fallo AST era solo del test (`^` vs XOR); corregido tests-only.
- No declarar B29 PASS bilateral ni avanzar a B30 hasta que Plus H1d SUCCESS y su evidencia 38/38. Baseline B28 PASS_SCOPED; global OPEN.

---
# Actualización de certificación — 2026-11-06 UTC (r446)

## Algebra229 AS-B-29 — WAIT (Plus H1d y CI pendientes)

- Contrato N2: factorizar 123456789 → 3^2*3607*3803. Tests fortalecidos bilateralmente: fila congelada exacta, salida ASCII, primalidad por división de prueba, multiplicidades [2,1,1], producto exacto y endpoint HTTP Plus.
- Lite SHA `1004174a0cd6ad29c9b252097f2664175c277918`: Cumulative 42292655779 SUCCESS (focal 4/4; 2,267 passed); CI 42292655724 SUCCESS (focal 4/4); H1d 42292655725 SUCCESS (22/22); Scientific UI 42292655744 SUCCESS (456/456 desktop/tablet/mobile). Los gates de Lite están completos.
- Plus SHA corregido `534e5f208cb5986794f3c2aea8b3056fb9d30e7f`: Cumulative 42293287002 SUCCESS; focal B29 3/3 PASS; guard `skip=false`, `evidence_run_id` vacío; backend 2,808 passed, 1 skipped, 10 xfailed. Cumulative frontend/backend SUCCESS.
- Plus H1d 42293286948 sigue IN_PROGRESS en instalación de Chromium; Plus CI 42293286925 sigue IN_PROGRESS en Backend tests (frontend SUCCESS). No se acredita el primer SHA `4fac5e5…`: su fallo era solo el AST auxiliar del test interpretando `^` como XOR. Corregido en el SHA actual, sin tocar el motor.
- No declarar B29 PASS bilateral ni avanzar a B30 hasta que Plus H1d y CI terminen SUCCESS y se revisen sus logs/guards. Último baseline: AS-B-28 PASS_SCOPED; global OPEN.

---
# Actualización de certificación — 2026-11-06 UTC (r445)

## Algebra229 AS-B-29 — WAIT (revalidación bilateral pendiente)

- Contrato: N2, factorizar 123456789 → 3^2*3607*3803. Se reforzaron los tests Lite/Plus con comparación de las ocho celdas congeladas, forma ASCII y oráculo independiente por división de prueba; primalidad y multiplicidades [2,1,1], producto exacto y evaluación independiente.
- Lite SHA `1004174a0cd6ad29c9b252097f2664175c277918`: Cumulative 42292655779 SUCCESS (focal 4/4; 366 archivos, 2,267 passed, 8 expected fail, 34 TODO); CI 42292655724 SUCCESS (focal 4/4); H1d 42292655725 SUCCESS (22/22); Scientific UI 42292655744 SUCCESS (456/456 desktop/tablet/mobile). Los guards Cumulative/H1d/Scientific indican `skip=false` y `evidence_run_id` vacío.
- Plus test SHA inicial `4fac5e52415d7a9ad03d222a899ad9a19b8e1be2`: Cumulative 42292660804 falló únicamente en la evaluación AST auxiliar del test. La fila congelada, el endpoint HTTP y el oráculo de factores primos pasaron; el error fue `BitXor` porque Python interpreta `^` como XOR. No se observó fallo del motor/API.
- Plus test corregido SHA `534e5f208cb5986794f3c2aea8b3056fb9d30e7f`: se normaliza `^` a `**` exclusivamente dentro del evaluador AST del test. Nuevas corridas exact-SHA: Cumulative 42293287002, H1d 42293286948 y CI 42293286925 siguen IN_PROGRESS. Los jobs frontend Cumulative y CI completaron SUCCESS; los backends y H1d permanecen activos.
- No se registra aceptación bilateral de B29 todavía. No avanzar a B30 ni lanzar gates duplicados mientras continúe la revalidación exact-SHA.
- Baseline bilateral vigente: AS-B-28 `PASS_SCOPED`. Certificación global `OPEN`.

---
# Actualización de certificación — 2026-11-06 UTC (r444)

## Algebra229 AS-B-28 — PASS_SCOPED bilateral (r444)

- Lite SHA técnico `6aa6b374f50a199886d6f022409f74b457fab2e9`: Cumulative 42283415265 SUCCESS (focal 4/4; 366 archivos, 2,266 passed, 8 expected fail, 34 TODO); H1d 42283415226 SUCCESS (22/22); Scientific UI 42283415403 SUCCESS (456/456 desktop/tablet/mobile); CI 42283415015 SUCCESS; Runner 42283415020 SUCCESS (fingerprint push-only).
- Plus SHA técnico `ab434ccf746ed9fb83b643e5eedc26b69c5f814b`: Cumulative 42283418797 SUCCESS (frontend/backend; focal 3/3; backend 2,807 passed, 1 skipped, 10 xfailed); H1d 42283418744 SUCCESS (38/38); CI 42283418918 SUCCESS (2,807 passed, 1 skipped, 10 xfailed; coverage 88.91%); Runner 42283418924 SUCCESS (fingerprint push-only).
- Los gates aplicables registraron `skip=false` y `evidence_run_id` vacío; los tests focales fueron ejecutados en los SHA exactos, sin REUSE.
- Acceptance bilateral: `ALGEBRA229_AS_B_28_ACCEPTANCE_2026-11-06.md`. Las fallas preliminares fueron regex incorrectas de los tests; se corrigieron únicamente los tests, no el motor.
- **Siguiente:** AS-B-29, N2, factorizar 123456789 → 3^2*3607*3803. Reforzar fila exacta y oráculo independiente por división de prueba/primalidad. Global **OPEN**.

---
# Actualización de certificación — 2026-11-06 UTC (r443)

## Algebra229 AS-B-27 — PASS_SCOPED bilateral (r443)

- Lite HEAD técnico a69eacd5b64b371bee52ee88ae3869976092b2d3: Cumulative 42274271213 SUCCESS (focal 4/4; 366 archivos, 2,265 passed, 8 expected fail, 34 TODO); H1d 42274271107 SUCCESS (22/22); Scientific UI 42274271105 SUCCESS (456/456 desktop/tablet/mobile); CI 42274271188 SUCCESS; Runner 42274271145 SUCCESS (fingerprint push-only).
- Plus HEAD técnico f817f1c568635b4b64f26e54eb3a41b22a0712ed: Cumulative 42274292997 SUCCESS (frontend/backend; focal 3/3; backend 2,806 passed, 1 skipped, 10 xfailed); H1d 42274292987 SUCCESS (38/38); CI 42274293004 SUCCESS (backend 2,806 passed, 1 skipped, 10 xfailed; cobertura 88.91%); Runner 42274293046 SUCCESS (fingerprint push-only).
- Los seis jobs de gates registraron skip=false y evidence_run_id vacío; evidencia ejecutada en los SHA exactos, sin REUSE.
- Acceptance bilateral: ALGEBRA229_AS_B_27_ACCEPTANCE_2026-11-06.md. Solo se reforzaron tests; ningún cambio de producto o motor.
- Siguiente: AS-B-28, N3, factorizar 4294967297 → 641*6700417. Los tests actuales solo verifican presencia de fila/salida/equivalencia; reforzar fila exacta y oráculo independiente de primalidad, multiplicidades y producto. Global OPEN.

---
# Actualización de certificación — 2026-11-06 UTC (r442)

## Algebra229 AS-B-26 — PASS_SCOPED bilateral (r442)

**Contrato:** `factorizar el entero 360` → `2^{3}\\cdot 3^{2}\\cdot 5` (N2). Los oráculos comparan las celdas exactas de la matriz congelada, la forma ASCII y una factorización independiente por división de prueba, incluyendo multiplicidades primas y producto 360.

### Lite — SHA técnico `26cc8cc69d32e4a5614dc9921a87030308f9cdd1`
- Cumulative [42270957296](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957296) SUCCESS; focal 4/4, 366/366 archivos, 2,264 passed, 8 expected fail y 34 TODO.
- H1d [42270957306](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957306) SUCCESS; 22/22 Playwright.
- CI [42270957315](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957315) SUCCESS.
- Scientific UI [42270957389](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957389) SUCCESS; 456/456 desktop/tablet/mobile.
- Runner [42270957317](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957317) SUCCESS; push-only.

### Plus — SHA técnico corregido `4509e41570258a1f573f8992475433b1b05ef120`
- Cumulative [42272022466](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022466) SUCCESS; focal 3/3, backend 2,805 passed, 1 skipped, 10 xfailed.
- H1d [42272022376](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022376) SUCCESS; 38/38 Playwright.
- CI [42272022354](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022354) SUCCESS; frontend/backend, 2,805 passed, 1 skipped, 10 xfailed.
- Runner [42272022361](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022361) SUCCESS; push-only.

### Diagnóstico y alcance
La primera revalidación de CI Plus [42271188505](https://github.com/c2melendez/precision-lab-plus/actions/runs/42271188505), SHA `ef97ca2a23324d2512f4f26585ad51f421d316ff`, falló únicamente por doble escape en la expectativa del test de fila. La matriz congelada contiene una sola barra invertida; el test raw-string se corrigió. Los gates posteriores en SHA `4509e415...` pasan y son la evidencia válida. No hubo cambio del motor ni del producto; únicamente tests. Aceptación: `ALGEBRA229_AS_B_26_ACCEPTANCE_2026-11-06.md`.

La aceptación de AS-B-26 es **PASS_SCOPED bilateral**. SG28/H2/DIST, SECURITY-S25 y otros gaps independientes permanecen abiertos; certificación global **OPEN**.

**Siguiente:** AS-B-27, `\\text{factorizar el entero }1001` → `7\\cdot 11\\cdot 13` (N2). Global **OPEN**.

---

# Actualización de certificación — 2026-11-06 UTC (r440)

## Algebra229 AS-B-26 — WAIT (Plus revalidación exact-SHA)

**Contrato:** `factorizar el entero 360` → `2^{3}\\cdot 3^{2}\\cdot 5` (N2). Los tests ahora exigen fila congelada completa, salida ASCII exacta y un oráculo independiente de división de prueba que verifica `2^3·3^2·5` y el producto 360.

### Lite — SHA técnico `26cc8cc69d32e4a5614dc9921a87030308f9cdd1`
- Cumulative [42270957296](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957296) SUCCESS; focal 4/4, 366/366 archivos, 2,264 passed, 8 expected fail y 34 TODO.
- H1d [42270957306](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957306) SUCCESS; 22/22.
- CI [42270957315](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957315) SUCCESS.
- Scientific UI [42270957389](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957389) SUCCESS; 456/456 desktop/tablet/mobile.
- Runner [42270957317](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957317) SUCCESS.

### Plus — SHA técnico corregido `4509e41570258a1f573f8992475433b1b05ef120`
- Cumulative [42272022466](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022466) IN_PROGRESS.
- CI [42272022354](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022354) IN_PROGRESS.
- H1d [42272022376](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022376) IN_PROGRESS.
- Runner [42272022361](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022361) SUCCESS.

### Diagnóstico y decisión
La primera revalidación Plus en SHA `ef97ca2a23324d2512f4f26585ad51f421d316ff` falló solo en la comparación literal de la fila: el test esperaba dos barras invertidas donde el fixture fuente contiene una. Se corrigió el raw string; no hubo fallo en el cálculo/factorización ni cambio de producto. CI previo [42271188505](https://github.com/c2melendez/precision-lab-plus/actions/runs/42271188505) se conserva como diagnóstico y **no** se usa para PASS. El SHA corregido `4509e415...` tiene gates nuevos en curso.

Estado **WAIT**. No relanzar gates equivalentes ni aceptar AS-B-26 hasta revisar los tres gates Plus del SHA corregido. Certificación global **OPEN**; SG28/H2/DIST, SECURITY-S25 y gaps independientes permanecen abiertos.

**Siguiente:** cerrar AS-B-26 tras los gates Plus; después AS-B-27 (`factorizar 1001` → `7·11·13`).

---

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


