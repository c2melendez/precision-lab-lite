# Algebra229 AS-B-24 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global permanece **OPEN**.

## Contrato
- AS-B-24, N3, operación `factorizar`.
- Entrada de matriz: `x^{2}-2\ \text{sobre }\mathbb{R}`.
- Salida de matriz: `\left(x - \sqrt{2}\right) \left(x + \sqrt{2}\right)`.
- Nota congelada: `Con raíces permitidas: (x-\sqrt{2})(x+\sqrt{2}).`
- Salida ASCII que devuelve la interfaz/motor: `(x-sqrt(2))*(x+sqrt(2))`.
- Se conserva la distinción con AS-B-23: sobre ℚ, `x^2-2` permanece irreducible.

## Pruebas
- Lite `tests/algebra229AsB24.audit.test.ts`: cuatro pruebas; compara las siete celdas semánticas de la fila congelada, salida ASCII exacta, equivalencia simbólica y oráculo numérico independiente con diez muestras enteras `[0,1,-1,2,-2,3,-3,4,5,10]`.
- Plus `backend/tests/test_algebra229_as_b24.py`: tres pruebas; fila congelada exacta, endpoint HTTP `POST /api/v1/factor`, forma ASCII, equivalencia SymPy y evaluador AST independiente con las mismas diez muestras.

## Evidencia Lite — SHA `2342cbd5ac2de6e9a7b1fbf42ddb9df4ee1f9c8d`
- Cumulative [42222060038](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060038) SUCCESS; job 127906275669; focal 4/4; 366/366 archivos.
- CI [42222060154](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060154) SUCCESS; job 127906274051; focal 4/4; 366/366 archivos; typecheck, unit/parity y build SUCCESS.
- Scientific UI [42222060025](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060025) SUCCESS; job 127906273503; 456/456 Playwright en desktop/tablet/mobile.
- H1d [42222060032](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222060032) SUCCESS; job 127906273506; 22/22 Playwright desktop Chromium.
- Runner [42222059941](https://github.com/c2melendez/precision-lab-lite/actions/runs/42222059941) SUCCESS; push-only fingerprint, no gate dispatch adicional.

## Evidencia Plus — SHA `5d8d78f8e35d02830bfbce63c107fe5990904cd1`
- Cumulative [42221909462](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909462) SUCCESS; frontend/backend SUCCESS; focal 3/3; backend 2,803 passed, 1 skipped, 10 xfailed.
- H1d [42221909235](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909235) SUCCESS; 38/38 Playwright.
- CI [42221909164](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221909164) SUCCESS; frontend/backend SUCCESS; backend 2,803 passed, 1 skipped, 10 xfailed.
- Runner [42221910347](https://github.com/c2melendez/precision-lab-plus/actions/runs/42221910347) SUCCESS; push-only fingerprint.

## Alcance
- Logs focales confirman ejecución real de los tests en los SHA técnicos indicados; no se acreditó por REUSE.
- Los únicos cambios técnicos fueron los dos archivos de pruebas. No se cambió motor, parser, frontend o backend de producto.
- Los intentos intermedios corrigieron las aserciones del harness para reflejar fielmente las ocho posiciones delimitadas y los escapes de la fila fuente; no fueron fallos del producto matemático.
- SG28/H2/DIST, SECURITY-S25 y otros capability gaps no relacionados no se cierran con este caso.

**Siguiente acción:** AS-B-25, factorizar `x^2+1` sobre ℂ solo ante el sufijo explícito `sobre ℂ`; sin sufijo no introducir `i`. Global **OPEN**.
