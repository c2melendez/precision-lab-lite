# Algebra229 AS-B-23 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global permanece **OPEN**.

## Contrato
- AS-B-23, N2, `factorizar`, `x^{2}-2` → `x^{2} - 2`.
- La fila congelada declara: “Irreducible sobre ℚ: debe quedar igual.”
- Test Lite: `tests/algebra229AsB23.audit.test.ts` (3 tests): siete celdas exactas de la fila fuente; resultado equivalente e inalterado sin producto de factores; discriminante 8 no cuadrado perfecto y oráculo numérico independiente en diez muestras enteras [0, 1, -1, 2, -2, 3, -3, 4, 5, 10].
- Test Plus (par bilateral): `backend/tests/test_algebra229_as_b23.py` (3 tests): siete celdas exactas; respuesta HTTP de `POST /api/v1/factor` inalterada; coeficientes `[1, 0, -2]`, discriminante 8 no cuadrado perfecto y evaluador entero independiente restringido por AST en las mismas diez muestras.

## Evidencia Lite SHA `f99fff6c06d7950ff14a8711e88035f9c7afd881`
- Cumulative [42218347585](https://github.com/c2melendez/precision-lab-lite/actions/runs/42218347585) SUCCESS; focal `algebra229AsB23.audit.test.ts` 3/3 PASS; suite: 366 archivos, 2,261 passed, 8 expected fail y 34 TODO.
- H1d [42218347590](https://github.com/c2melendez/precision-lab-lite/actions/runs/42218347590) SUCCESS; 22/22 Playwright PASS.
- Scientific UI [42218347639](https://github.com/c2melendez/precision-lab-lite/actions/runs/42218347639) SUCCESS; 456/456 Playwright PASS en desktop, tablet y mobile.
- CI [42218347555](https://github.com/c2melendez/precision-lab-lite/actions/runs/42218347555) SUCCESS; suite focal 3/3 PASS; 366 archivos.
- Runner [42218347616](https://github.com/c2melendez/precision-lab-lite/actions/runs/42218347616) SUCCESS; solo calculó huella en evento push, no despachó otro gate.

## Evidencia Plus (par bilateral) SHA `120184413febf16d6471ee0b72a30cabe467fa0c`
- Cumulative [42218368185](https://github.com/c2melendez/precision-lab-plus/actions/runs/42218368185) SUCCESS; frontend y backend SUCCESS; focal `test_algebra229_as_b23.py` 3/3 PASS; backend: 2,802 passed, 1 skipped y 10 xfailed.
- H1d [42218368203](https://github.com/c2melendez/precision-lab-plus/actions/runs/42218368203) SUCCESS; 38/38 Playwright PASS.
- CI [42218368283](https://github.com/c2melendez/precision-lab-plus/actions/runs/42218368283) SUCCESS; frontend y backend SUCCESS; backend: 2,802 passed, 1 skipped y 10 xfailed.
- Runner [42218368207](https://github.com/c2melendez/precision-lab-plus/actions/runs/42218368207) SUCCESS; solo calculó huella en evento push, no despachó otro gate.

## Revisión de continuidad y alcance
- Las corridas requeridas se ejecutaron sobre los SHA técnicos indicados; los logs muestran las tres pruebas focales como PASSED, no REUSE.
- Los gates aplicables quedaron SUCCESS: Lite cumulative/H1d/Scientific UI y Plus cumulative/H1d; CI y Runner también concluyeron SUCCESS.
- El diff técnico de ambos repositorios modifica únicamente los tests focales. No hubo cambio del motor ni del producto.
- La suite conserva explícitamente la diferencia de dominio: AS-B-23 es irreducible sobre ℚ y debe quedar igual; la fila siguiente AS-B-24 permite raíces reales.
- SG28/H2/DIST, SECURITY-S25 y los demás capability gaps no cambian por este caso. No se declara certificación global.

Siguiente: AS-B-24 `factor(x^2-2) sobre ℝ` → `(x-sqrt(2))*(x+sqrt(2))` (N3, factorización con raíces reales permitidas). Global **OPEN**.
