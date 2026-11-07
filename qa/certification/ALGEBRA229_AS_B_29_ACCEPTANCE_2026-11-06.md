# Algebra229 AS-B-29 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global continúa **OPEN**.

## Contrato y oráculos
- AS-B-29, N2: factorizar el entero 123456789 → 3^2*3607*3803.
- Lite: `tests/algebra229AsB29.audit.test.ts`, 4/4 tests: ocho celdas exactas de la fila congelada; salida ASCII; primalidad y multiplicidad por división de prueba independiente; producto exacto y equivalencia simbólica con el entero original.
- Plus (par bilateral): `backend/tests/test_algebra229_as_b29.py`, 3/3 tests: fila congelada; endpoint HTTP `POST /api/v1/factor`; salida ASCII; primalidad, multiplicidades `[2,1,1]`, evaluación AST restringida y producto exacto.

## Evidencia Lite — SHA `1004174a0cd6ad29c9b252097f2664175c277918`
- Cumulative [42292655779](https://github.com/c2melendez/precision-lab-lite/actions/runs/42292655779) SUCCESS; focal 4/4; 366 archivos, 2,267 passed, 8 expected fail, 34 TODO.
- H1d [42292655725](https://github.com/c2melendez/precision-lab-lite/actions/runs/42292655725) SUCCESS; 22/22 Playwright.
- Scientific UI [42292655744](https://github.com/c2melendez/precision-lab-lite/actions/runs/42292655744) SUCCESS; 456/456 desktop/tablet/mobile.
- CI [42292655724](https://github.com/c2melendez/precision-lab-lite/actions/runs/42292655724) SUCCESS; focal 4/4.
- Runner [42292655803](https://github.com/c2melendez/precision-lab-lite/actions/runs/42292655803) SUCCESS; fingerprint push-only.

## Evidencia Plus (par bilateral) — SHA `534e5f208cb5986794f3c2aea8b3056fb9d30e7f`
- Cumulative [42293287002](https://github.com/c2melendez/precision-lab-plus/actions/runs/42293287002) SUCCESS; frontend/backend SUCCESS; focal 3/3; backend 2,808 passed, 1 skipped, 10 xfailed.
- H1d [42293286948](https://github.com/c2melendez/precision-lab-plus/actions/runs/42293286948) SUCCESS; 38/38 Playwright.
- CI [42293286925](https://github.com/c2melendez/precision-lab-plus/actions/runs/42293286925) SUCCESS; 2,808 passed, 1 skipped, 10 xfailed; coverage 88.88%.
- Runner [42293287033](https://github.com/c2melendez/precision-lab-plus/actions/runs/42293287033) SUCCESS; fingerprint push-only.

## Integridad de evidencia y diagnóstico
- Cumulative/H1d/Scientific registraron `skip=false` y `evidence_run_id` vacío; ejecución real en los SHA técnicos exactos, sin REUSE.
- Los logs focales muestran los cuatro tests Lite y los tres tests Plus de B29 en PASS.
- La corrida preliminar Plus sobre SHA `4fac5e52415d7a9ad03d222a899ad9a19b8e1be2` falló únicamente en el AST auxiliar del test (`^` interpretado como XOR). Se corrigió solo el helper del test; no hubo cambio de motor, API ni producto.
- No hay cambios de motor, API ni producto matemático. Los gaps independientes SG28/H2/DIST y SECURITY-S25 permanecen abiertos; certificación global **OPEN**.

Siguiente: AS-B-30, N3, `valor` — `\text{¿es primo }1000000007?` → `sí, es primo`. Test-first bilateral: fila congelada exacta, endpoint real, oráculo independiente de primalidad y control compuesto. Gates: Lite cumulative+H1d+Scientific UI+CI; Plus cumulative+H1d+CI.
