# Algebra229 AS-C-09 - aceptación bilateral (Lite)

**Resultado: PASS bilateral.** La certificación global continúa **OPEN**.

## Contrato y oráculos
- AS-C-09, N2, `simplificar`: `\frac{a}{b}+\frac{b}{a}` → `\frac{a^{2} + b^{2}}{a b}`, sin nota de dominio en la fila congelada.
- Lite: `tests/algebra229AsC09.audit.test.ts`, 4/4 tests: ocho celdas exactas de la fila congelada; `simplifyExpression` devuelve una única fracción canónica y la diferencia simbólica es `0`; oráculo numérico independiente en cinco muestras con `a,b != 0`; `ErrorCode.DOMAIN_ERROR` en `a=0`, `b=0` y `a=b=0`.
- Plus (par bilateral): `backend/tests/test_algebra229_as_c09.py`, 4/4 tests: fila congelada; fracción combinada; oráculo `Fraction`; control de dominio.

## Implementación
- Lite no requirió cambios: la ruta `combinedSingleFraction` introducida en C-05 aplica `rationalize()` y devuelve `(a^2+b^2)/(a*b)` correctamente. Verificado con tests test-first en verde desde el primer commit de pruebas (`388048d0`).
- Plus sí requirió una corrección acotada de producto (`_is_sum_of_fractions` + `_is_single_fraction_with_product_denominator` en `_cancel_common_factors`). El commit de pruebas de Plus `bc4473f` falló exactamente en la expectativa de fracción combinada y quedó en verde con el fix.
- No se relajó ningún oráculo matemático.

## Evidencia Lite - SHA `388048d0d5811c2f52d1fc877c5fa70bc9b687a1`
- Cumulative [42451545801](https://github.com/c2melendez/precision-lab-lite/actions/runs/42451545801) SUCCESS; focal AS-C-09 4/4 (622 ms); 376 archivos, 2,313 passed, 8 expected fail, 34 TODO.
- CI [42451545670](https://github.com/c2melendez/precision-lab-lite/actions/runs/42451545670) SUCCESS; focal AS-C-09 4/4 (479 ms); 376 archivos, 2,313 passed.
- H1d [42451545781](https://github.com/c2melendez/precision-lab-lite/actions/runs/42451545781) SUCCESS; 22/22 Playwright.
- Scientific UI [42451545826](https://github.com/c2melendez/precision-lab-lite/actions/runs/42451545826) SUCCESS; 456/456.
- Runner [42451545669](https://github.com/c2melendez/precision-lab-lite/actions/runs/42451545669) SUCCESS.
- Runs por push sin inputs de dispatch: guard `skip=false`, `evidence_run_id` vacío, sin REUSE.

## Evidencia Plus (par bilateral) - SHA `75f3bd5a3ff8455893ca469d15b38c572ab4c27a`
- Test-first: `bc4473f` Cumulative [42451545272](https://github.com/c2melendez/precision-lab-plus/actions/runs/42451545272) FAILED en `test_as_c09_simplify_endpoint_returns_one_combined_fraction` (devolvía `a/b + b/a`).
- Cumulative [42451561391](https://github.com/c2melendez/precision-lab-plus/actions/runs/42451561391) SUCCESS; focal AS-C-09 4/4 PASS.
- CI [42451561464](https://github.com/c2melendez/precision-lab-plus/actions/runs/42451561464) SUCCESS; 2,848 passed, 1 skipped, 10 xfailed; cobertura 88.90%.
- H1d [42451561379](https://github.com/c2melendez/precision-lab-plus/actions/runs/42451561379) SUCCESS; 38/38 Playwright.
- Native Syntax and Recovery [42451561395](https://github.com/c2melendez/precision-lab-plus/actions/runs/42451561395) SUCCESS.
- Runner [42451561385](https://github.com/c2melendez/precision-lab-plus/actions/runs/42451561385) SUCCESS.

## Diagnóstico y clasificación
- Gap de capability real en Plus (suma de fracciones sin combinar), corregido en producto y cubierto con regresión permanente. Lite ya cumplía.
- El gate de seguridad de Plus (S25) y SG28/H2/DIST siguen siendo frentes independientes abiertos; global **OPEN**.

Siguiente: AS-C-10, N2, `simplificar` - `\frac{1-\frac{1}{x^{2}}}{1-\frac{1}{x}}` → `\frac{x + 1}{x}`, sin nota de dominio en la fila congelada.
