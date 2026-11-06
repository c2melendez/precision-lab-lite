# Algebra229 AS-B-22 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global permanece **OPEN**.

## Contrato
- AS-B-22, N1, `factorizar`, `x^{2}+1` → `x^{2} + 1`.
- La fila congelada declara: “Irreducible sobre ℚ y ℝ: debe quedar igual.”
- Test Lite: `tests/algebra229AsB22.audit.test.ts` (3 tests): siete celdas exactas de la fila fuente; resultado equivalente e inalterado, sin producto de factores; oráculo numérico independiente en diez muestras enteras [0, 1, -1, 2, -2, 3, -3, 4, 5, 10], comparado con (x^2+1) y positividad.
- Test Plus (par bilateral): `backend/tests/test_algebra229_as_b22.py` (3 tests): siete celdas exactas; respuesta HTTP de `POST /api/v1/factor` sin factorización; coeficientes `[1, 0, 1]`, discriminante (-4) y evaluador entero independiente restringido por AST en las diez muestras.

## Evidencia Lite SHA `b385d88845d9f1e257cbce03295c73273cf4446b`
- Cumulative [42211290550](https://github.com/c2melendez/precision-lab-lite/actions/runs/42211290550) SUCCESS; focal `algebra229AsB22.audit.test.ts` 3/3 PASS; suite: 366 archivos, 2,260 passed, 8 expected fail y 34 TODO.
- H1d [42211290765](https://github.com/c2melendez/precision-lab-lite/actions/runs/42211290765) SUCCESS; 22/22 Playwright PASS.
- Scientific UI [42211290551](https://github.com/c2melendez/precision-lab-lite/actions/runs/42211290551) SUCCESS; 456/456 Playwright PASS en desktop, tablet y mobile.
- CI [42211290654](https://github.com/c2melendez/precision-lab-lite/actions/runs/42211290654) SUCCESS.
- Runner [42211290975](https://github.com/c2melendez/precision-lab-lite/actions/runs/42211290975) SUCCESS; solo calculó huella en evento push, no despachó otro gate.

## Evidencia Plus (par bilateral) SHA `c2bc727e04d12867bfff1b718c072fe735cf1003`
- Cumulative [42211299152](https://github.com/c2melendez/precision-lab-plus/actions/runs/42211299152) SUCCESS; frontend y backend SUCCESS; focal `test_algebra229_as_b22.py` 3/3 PASS; backend: 2,801 passed, 1 skipped y 10 xfailed.
- H1d [42211299254](https://github.com/c2melendez/precision-lab-plus/actions/runs/42211299254) SUCCESS; 38/38 Playwright PASS.
- CI [42211299150](https://github.com/c2melendez/precision-lab-plus/actions/runs/42211299150) SUCCESS.
- Runner [42211299262](https://github.com/c2melendez/precision-lab-plus/actions/runs/42211299262) SUCCESS; solo calculó huella en evento push, no despachó otro gate.

## Revisión de continuidad y alcance
- Los seis jobs de gates aplicables registraron `skip=false`, `evidence_run_id=""` y “No reusable completed evidence found”; los tests se ejecutaron sobre el SHA técnico indicado, no se acreditaron por REUSE.
- El runner de push no cuenta como prueba adicional: su dispatch y publicación quedaron omitidos por diseño.
- El diff técnico de ambos repositorios modifica únicamente sus tests focales. No hubo cambio del motor ni del producto; el refuerzo pasó sin fase roja.
- Se reconcilió la fotografía documental: en Lite el índice y CURRENT_STATE estaban en r420 mientras EXECUTION_LOG ya conservaba r432; se actualizan ahora al mismo r433 en ambos repositorios. Se preserva íntegro el historial anterior.
- SG28/H2/DIST, SECURITY-S25 y los demás capability gaps no cambian por este caso. No se declara certificación global.

Siguiente: AS-B-23 `x^{2}-2` → `x^{2} - 2` (N2, irreducible sobre ℚ: debe quedar igual). Global **OPEN**.
