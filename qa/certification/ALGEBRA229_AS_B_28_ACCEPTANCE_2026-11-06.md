# Algebra229 AS-B-28 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global continúa **OPEN**.

## Contrato y oráculos
- AS-B-28, N3: factorizar el entero 4294967297 → 641*6700417.
- Lite: `tests/algebra229AsB28.audit.test.ts`, 4/4 tests: ocho celdas exactas de la fila congelada; salida ASCII exacta; división de prueba independiente; primalidad de cada factor; multiplicidad 1 y producto 4294967297; equivalencia simbólica.
- Plus (par bilateral): `backend/tests/test_algebra229_as_b28.py`, 3/3 tests: ocho celdas exactas; endpoint HTTP POST `/api/v1/factor`; salida ASCII exacta; división de prueba independiente; primalidad, multiplicidades y evaluación AST restringida.

## Evidencia Lite — SHA `6aa6b374f50a199886d6f022409f74b457fab2e9`
- Cumulative [42283415265](https://github.com/c2melendez/precision-lab-lite/actions/runs/42283415265) SUCCESS; focal 4/4; 366 archivos, 2,266 passed, 8 expected fail, 34 TODO.
- H1d [42283415226](https://github.com/c2melendez/precision-lab-lite/actions/runs/42283415226) SUCCESS; 22/22 Playwright.
- Scientific UI [42283415403](https://github.com/c2melendez/precision-lab-lite/actions/runs/42283415403) SUCCESS; 456/456 desktop/tablet/mobile.
- CI [42283415015](https://github.com/c2melendez/precision-lab-lite/actions/runs/42283415015) SUCCESS; dependency audit, typecheck, unit/parity y build.
- Runner [42283415020](https://github.com/c2melendez/precision-lab-lite/actions/runs/42283415020) SUCCESS; fingerprint push-only, sin dispatch adicional.

## Evidencia Plus (par bilateral) — SHA `ab434ccf746ed9fb83b643e5eedc26b69c5f814b`
- Cumulative [42283418797](https://github.com/c2melendez/precision-lab-plus/actions/runs/42283418797) SUCCESS; frontend/backend SUCCESS; focal 3/3; 2,807 passed, 1 skipped, 10 xfailed.
- H1d [42283418744](https://github.com/c2melendez/precision-lab-plus/actions/runs/42283418744) SUCCESS; 38/38 Playwright.
- CI [42283418918](https://github.com/c2melendez/precision-lab-plus/actions/runs/42283418918) SUCCESS; 2,807 passed, 1 skipped, 10 xfailed; coverage 88.91%.
- Runner [42283418924](https://github.com/c2melendez/precision-lab-plus/actions/runs/42283418924) SUCCESS; fingerprint push-only, sin dispatch adicional.

## Integridad de evidencia y diagnóstico
- Cumulative/H1d/Scientific registraron `skip=false` y `evidence_run_id` vacío; ejecución real en los SHA técnicos exactos, sin REUSE.
- Los logs focales muestran los cuatro tests Lite y los tres tests Plus de B28 en PASS. La salida del motor fue correcta desde la primera ejecución.
- Las corridas preliminares Lite `42282498165` / CI `42282498045` y Plus `42282507377` / CI `42282507390` fallaron por escapes dobles en regex añadidas a los tests (lectura de filas y parseo numérico), no por producto. Se corrigieron los tests, no el motor; sus resultados no se usan para aceptar B28.
- Los cambios de código son exclusivamente de tests. No hay modificación del motor, API ni producto matemático.
- SG28/H2/DIST, SECURITY-S25 y otros gaps independientes permanecen abiertos; certificación global **OPEN**.

Siguiente: AS-B-29, N2, factorizar 123456789 → 3^2*3607*3803. Test-first bilateral: comparar todas las celdas de la fila congelada; salida ASCII exacta; oráculo independiente por división de prueba que compruebe los tres factores primos, multiplicidades [2,1,1] y producto exacto. Gates: Plus cumulative+H1d; Lite cumulative+H1d+Scientific UI.
