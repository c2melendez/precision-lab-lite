# Algebra229 AS-C-08 - aceptación bilateral (Lite)

**Resultado: PASS bilateral.** La certificación global continúa **OPEN**.

## Contrato y oráculos
- AS-C-08, N2, `simplificar`: `\frac{x+1}{x^{2}-1}-\frac{1}{x-1}` → `0`, sin nota de dominio en la fila congelada.
- Lite: `tests/algebra229AsC08.audit.test.ts`, 4/4 tests: ocho celdas exactas de la fila congelada; `simplifyExpression` devuelve `0`; oráculo numérico independiente en muestras fuera de `x=±1`; `ErrorCode.DOMAIN_ERROR` en `x=1` y `x=-1`.
- Plus (par bilateral): `backend/tests/test_algebra229_as_c08.py`, 4/4 tests: fila congelada; cero exacto; oráculo `Fraction`; control de dominio.

## Implementación
- Test-first en verde sin cambios de producto en ninguno de los dos motores.

## Evidencia Lite - SHA `edfcfe6b0766bea686b2bde25e88b67f66ffc064`
- Cumulative [42450945971](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450945971) SUCCESS; focal AS-C-08 4/4 (990 ms); 375 archivos, 2,309 passed, 8 expected fail, 34 TODO.
- CI [42450946128](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450946128) SUCCESS; focal AS-C-08 4/4 (1,023 ms); 375 archivos, 2,309 passed.
- H1d [42450945960](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450945960) SUCCESS; 22/22 Playwright.
- Scientific UI [42450945998](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450945998) SUCCESS; 456/456.
- Runner [42450946110](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450946110) SUCCESS.
- Runs por push sin inputs de dispatch: guard `skip=false`, `evidence_run_id` vacío, sin REUSE.

## Evidencia Plus (par bilateral) - SHA `fc4b51bb206c0cd1e96106629b6ab984a2711f22`
- Cumulative [42450945978](https://github.com/c2melendez/precision-lab-plus/actions/runs/42450945978) SUCCESS; focal AS-C-08 4/4 PASS; backend y frontend SUCCESS.
- CI [42450946053](https://github.com/c2melendez/precision-lab-plus/actions/runs/42450946053) SUCCESS; 2,844 passed, 1 skipped, 10 xfailed; cobertura 88.88%.
- H1d [42450945950](https://github.com/c2melendez/precision-lab-plus/actions/runs/42450945950) SUCCESS; 38/38 Playwright.
- Runner [42450946020](https://github.com/c2melendez/precision-lab-plus/actions/runs/42450946020) SUCCESS.

## Diagnóstico y clasificación
- Test-first en verde; sin cambios de producto ni relajación de oráculos. El gate de seguridad de Plus (S25) y SG28/H2/DIST siguen siendo frentes independientes abiertos; global **OPEN**.

Siguiente: AS-C-09, N2, `simplificar` - `\frac{a}{b}+\frac{b}{a}` → `\frac{a^{2} + b^{2}}{a b}`, sin nota de dominio en la fila congelada.
