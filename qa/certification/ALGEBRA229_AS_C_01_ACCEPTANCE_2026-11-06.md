# Algebra229 AS-C-01 - aceptación bilateral (Lite)

**Resultado: PASS bilateral.** La certificación global continúa **OPEN**.

## Contrato y oráculos
- AS-C-01, N1, `simplificar`: `\frac{x^{2}-1}{x-1}` → `x + 1`, con nota de dominio `Válido para x\neq1`.
- Lite: `tests/algebra229AsC01.audit.test.ts`, 5/5 tests: ocho celdas exactas de la fila congelada; `simplifyExpression` devuelve exactamente `x+1`; diferencia simbólica `((x^2-1)/(x-1))-(x+1)` igual a `0`; oráculo aritmético independiente sobre muestras fuera de `x=1`; `ErrorCode.DOMAIN_ERROR` en el punto excluido.
- Plus (par bilateral): `backend/tests/test_algebra229_as_c01.py`, 5/5 tests: fila congelada; `POST /api/v1/simplify` con `result_text` exacto; `domain_conditions` con `x \neq 1`; oráculo con `Fraction`; `DOMAIN_ERROR` en `x=1`.

## Implementación
- Sin cambios de producto: la capacidad ya existía y el bloque solo añade regresiones permanentes. Se verificó el retorno real del motor, no solo la forma de la respuesta.
- No se relajó ningún oráculo matemático; la nota de dominio se exige explícitamente para no presentar la igualdad como válida en todo el dominio.

## Evidencia Lite - SHA `bb4e86b52a43f3da6b09651692f1a5f167f84f38`
- Cumulative [42331112760](https://github.com/c2melendez/precision-lab-lite/actions/runs/42331112760) SUCCESS; focal AS-C-01 5/5 (295 ms); 368 archivos, 2,276 passed, 8 expected fail, 34 TODO; run por push sin inputs de dispatch, guard `skip=false`, `evidence_run_id` vacío.
- H1d [42331112802](https://github.com/c2melendez/precision-lab-lite/actions/runs/42331112802) SUCCESS; 22/22 Playwright.
- Scientific UI [42331112826](https://github.com/c2melendez/precision-lab-lite/actions/runs/42331112826) SUCCESS.
- CI [42331112758](https://github.com/c2melendez/precision-lab-lite/actions/runs/42331112758) SUCCESS.
- Runner [42331112757](https://github.com/c2melendez/precision-lab-lite/actions/runs/42331112757) SUCCESS.

## Evidencia Plus (par bilateral) - SHA `e5dd15712a6522edd1f5638c64964b8bca302956`
- Cumulative [42331096760](https://github.com/c2melendez/precision-lab-plus/actions/runs/42331096760) SUCCESS; backend y frontend SUCCESS; focal AS-C-01 5/5 PASS; guard `skip=false`.
- CI [42331096764](https://github.com/c2melendez/precision-lab-plus/actions/runs/42331096764) SUCCESS; 2,816 passed, 1 skipped, 10 xfailed; cobertura 88.87%.
- H1d [42331096766](https://github.com/c2melendez/precision-lab-plus/actions/runs/42331096766) SUCCESS; 38/38 Playwright.
- Runner [42331096757](https://github.com/c2melendez/precision-lab-plus/actions/runs/42331096757) SUCCESS.

## Diagnóstico y clasificación
- Test-first en verde sin cambios de producto: la simplificación y la condición de dominio ya eran correctas en ambos motores. No hubo fallo de harness ni de oráculo.
- El gate de seguridad de Plus sigue siendo un frente independiente (S25) y no se usa como evidencia de este bloque. SG28/H2/DIST permanece abierto. Global **OPEN**.

Siguiente: AS-C-02, N1, `simplificar` - `\frac{x^{3}-1}{x^{2}-1}` → `\frac{x^{2}+x+1}{x+1}`, con su nota de dominio congelada.
