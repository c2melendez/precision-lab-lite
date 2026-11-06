# Algebra229 AS-B-27 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global permanece **OPEN**.

## Contrato
- AS-B-27, N2, factorizar el entero 1001 → 7*11*13.
- Test Lite: tests/algebra229AsB27.audit.test.ts (4 tests): las ocho celdas de la fila congelada; salida ASCII exacta; equivalencia simbólica; oráculo independiente por división de prueba que compara bases primas y multiplicidades [[7,1],[11,1],[13,1]] y verifica el producto 1001.
- Test Plus (par bilateral): backend/tests/test_algebra229_as_b27.py (3 tests): ocho celdas exactas; endpoint HTTP POST /api/v1/factor; salida ASCII exacta; división de prueba independiente, evaluación AST restringida y producto 1001.

## Evidencia Lite SHA a69eacd5b64b371bee52ee88ae3869976092b2d3
- Cumulative 42274271213 SUCCESS; focal 4/4; 366 archivos, 2,265 passed, 8 expected fail y 34 TODO.
- H1d 42274271107 SUCCESS; 22/22 Playwright.
- Scientific UI 42274271105 SUCCESS; 456/456 Playwright en desktop, tablet y mobile.
- CI 42274271188 SUCCESS; QA dependency audit hard gate, typecheck, unit/parity y production build completados.
- Runner 42274271145 SUCCESS; solo fingerprint de push: dispatch y persistencia quedaron omitidos por diseño.

## Evidencia Plus (par bilateral) SHA f817f1c568635b4b64f26e54eb3a41b22a0712ed
- Cumulative 42274292997 SUCCESS; frontend y backend SUCCESS; focal 3/3; backend 2,806 passed, 1 skipped y 10 xfailed.
- H1d 42274292987 SUCCESS; 38/38 Playwright.
- CI 42274293004 SUCCESS; backend 2,806 passed, 1 skipped, 10 xfailed; cobertura 88.91%.
- Runner 42274293046 SUCCESS; solo fingerprint de push, sin otro dispatch.

## Revisión de continuidad y alcance
- Los seis jobs de gates aplicables registraron skip=false y evidence_run_id vacío; los tests se ejecutaron en los SHA técnicos indicados, sin REUSE.
- Los logs confirman los cuatro tests Lite y los tres tests Plus de AS-B-27 en el gate acumulativo.
- Los diffs técnicos son exclusivamente tests. No hubo cambio de motor, API ni producto matemático.
- Se conserva el estado global OPEN. SG28/H2/DIST, SECURITY-S25 y otros gaps independientes no se cierran con este caso.

Siguiente: AS-B-28, N3, factorizar el entero 4294967297 → 641*6700417. Test-first: ampliar la fila de presencia a comparación exacta de celdas; probar bases primas, multiplicidades y producto con división de prueba independiente, sin depender de SymPy para el oráculo. Gates: Plus cumulative+H1d; Lite cumulative+H1d+Scientific UI.
