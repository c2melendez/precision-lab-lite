# Algebra229 AS-C-10 - aceptación bilateral (Lite)

**Resultado: PASS bilateral.** La certificación global continúa **OPEN**.

## Contrato y oráculos
- AS-C-10, N2, `simplificar`: `\frac{1-\frac{1}{x^{2}}}{1-\frac{1}{x}}` → `\frac{x + 1}{x}`, sin nota de dominio en la fila congelada.
- Lite: `tests/algebra229AsC10.audit.test.ts`, 4/4 tests: ocho celdas exactas de la fila congelada; `simplifyExpression` devuelve la forma simplificada `1+1/x`, distinta del input; la diferencia simbólica con la expectativa es `0`; oráculo numérico independiente en cinco muestras fuera de `x=0,1`; `ErrorCode.DOMAIN_ERROR` en los puntos excluidos.
- Plus (par bilateral): `backend/tests/test_algebra229_as_c10.py`, 4/4 tests; Plus devuelve la forma congelada exacta `(x + 1)/x`.
- La fila congelada no exige igualdad textual: se acepta `1+1/x` porque es algebraicamente equivalente (diferencia exacta `0`) y el motor sí simplificó respecto del input.

## Implementación
- Test-first en verde sin cambios de producto en ninguno de los dos motores.

## Evidencia Lite - SHA `fb964599b7379ab0d83646dab762d371608011fd`
- Cumulative [42452287676](https://github.com/c2melendez/precision-lab-lite/actions/runs/42452287676) SUCCESS; focal AS-C-10 4/4 (2,037 ms); 377 archivos, 2,317 passed, 8 expected fail, 34 TODO.
- CI [42452287666](https://github.com/c2melendez/precision-lab-lite/actions/runs/42452287666) SUCCESS; focal AS-C-10 4/4 (2,048 ms); 377 archivos, 2,317 passed.
- H1d [42452287697](https://github.com/c2melendez/precision-lab-lite/actions/runs/42452287697) SUCCESS; 22/22 Playwright.
- Scientific UI [42452287704](https://github.com/c2melendez/precision-lab-lite/actions/runs/42452287704) SUCCESS; 456/456.
- Runner [42452287683](https://github.com/c2melendez/precision-lab-lite/actions/runs/42452287683) SUCCESS.
- Runs por push sin inputs de dispatch: guard `skip=false`, `evidence_run_id` vacío, sin REUSE.

## Evidencia Plus (par bilateral) - SHA `87420a3aa61c7e8029574d2b312d34edc67adc89`
- Cumulative [42452288128](https://github.com/c2melendez/precision-lab-plus/actions/runs/42452288128) SUCCESS; focal AS-C-10 4/4 PASS.
- CI [42452288129](https://github.com/c2melendez/precision-lab-plus/actions/runs/42452288129) SUCCESS; 2,852 passed, 1 skipped, 10 xfailed; cobertura 88.90%.
- H1d [42452288132](https://github.com/c2melendez/precision-lab-plus/actions/runs/42452288132) SUCCESS; 38/38 Playwright.
- Runner [42452288091](https://github.com/c2melendez/precision-lab-plus/actions/runs/42452288091) SUCCESS.

## Diagnóstico y clasificación
- Test-first en verde; sin cambios de producto ni relajación de oráculos. La equivalencia `1+1/x` ≡ `(x+1)/x` se verifica exactamente, no por comparación textual.
- El gate de seguridad de Plus (S25) y SG28/H2/DIST siguen siendo frentes independientes abiertos; global **OPEN**.

Siguiente: AS-C-11, N3, `simplificar` - `\frac{1}{1+\frac{1}{1+\frac{1}{x}}}` → `\frac{x + 1}{2 x + 1}`, fracción continua de tres niveles.
