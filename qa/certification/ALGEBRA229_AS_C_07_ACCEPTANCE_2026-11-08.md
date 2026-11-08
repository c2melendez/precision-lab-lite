# Algebra229 AS-C-07 - aceptación bilateral (Lite)

**Resultado: PASS bilateral.** La certificación global continúa **OPEN**.

## Contrato y oráculos
- AS-C-07, N2, `simplificar`: `\frac{1}{x-1}-\frac{1}{x+1}` → `\frac{2}{\left(x - 1\right) \left(x + 1\right)}`, sin nota de dominio en la fila congelada.
- Lite: `tests/algebra229AsC07.audit.test.ts`, 4/4 tests: ocho celdas exactas de la fila congelada; salida simplificada y diferencia simbólica exacta `0` con la celda congelada; oráculo numérico independiente en muestras fuera de `x=±1`; `ErrorCode.DOMAIN_ERROR` en `x=1` y `x=-1`.
- Plus (par bilateral): `backend/tests/test_algebra229_as_c07.py`, 4/4 tests: fila congelada; diferencia exacta con la expectativa; oráculo `Fraction`; control de dominio.

## Representación
- Ambos motores devuelven `2/(x^2-1)`, forma algebraicamente idéntica a la celda congelada `2/((x-1)(x+1))` en el dominio `x != ±1`.
- El oráculo verifica la identidad de forma exacta y por muestreo independiente; la fila congelada y su expectativa no se modificaron. No se exige igualdad textual entre representaciones equivalentes.
- Sin cambios de producto.

## Evidencia Lite - SHA `2c807c5433de932e544a2c21ec702f7924a1ed22`
- Cumulative [42450296439](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450296439) SUCCESS; focal AS-C-07 4/4 (1,497 ms); 374 archivos, 2,305 passed, 8 expected fail, 34 TODO.
- CI [42450296465](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450296465) SUCCESS; focal AS-C-07 4/4 (1,265 ms).
- H1d [42450296447](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450296447) SUCCESS; 22/22 Playwright.
- Scientific UI [42450296494](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450296494) SUCCESS; 456/456.
- Runner [42450296577](https://github.com/c2melendez/precision-lab-lite/actions/runs/42450296577) SUCCESS.
- Runs por push sin inputs de dispatch: guard `skip=false`, `evidence_run_id` vacío, sin REUSE.

## Evidencia Plus (par bilateral) - SHA `7c61d94bf58342944bd163bafc08443c9cd364c5`
- Cumulative [42450284227](https://github.com/c2melendez/precision-lab-plus/actions/runs/42450284227) SUCCESS; focal AS-C-07 4/4 PASS; backend y frontend SUCCESS.
- CI [42450284226](https://github.com/c2melendez/precision-lab-plus/actions/runs/42450284226) SUCCESS; 2,840 passed, 1 skipped, 10 xfailed; cobertura 88.88%.
- H1d [42450284220](https://github.com/c2melendez/precision-lab-plus/actions/runs/42450284220) SUCCESS; 38/38 Playwright.
- Runner [42450284255](https://github.com/c2melendez/precision-lab-plus/actions/runs/42450284255) SUCCESS.

## Diagnóstico y clasificación
- Test-first en verde sin cambios de producto. La única diferencia es de representación (denominador expandido frente a factorizado), cubierta por oráculo exacto e independiente.
- El gate de seguridad de Plus (S25) y SG28/H2/DIST siguen siendo frentes independientes abiertos; global **OPEN**.

Siguiente: AS-C-08, N2, `simplificar` - `\frac{x+1}{x^{2}-1}-\frac{1}{x-1}` → `0`, sin nota de dominio en la fila congelada.
