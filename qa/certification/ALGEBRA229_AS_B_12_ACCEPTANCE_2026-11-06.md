# Algebra229 AS-B-12 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-12.

## Contrato y fuente
- Fila congelada: AS-B-12, N2, `factorizar`, `x^{5}-x` → `x \left(x - 1\right) \left(x + 1\right) \left(x^{2} + 1\right)`.
- Test: `tests/algebra229AsB12.audit.test.ts`, blob `25bf3761508e53d9c03e0b764fe184928d20eb08`.
- Celdas exactas + identidad algebraica + 10 sustituciones enteras independientes (`compileNumeric`).

## Evidencia SHA Lite `15b7dd0b1bc301571ce9f90596952360ea731d31`
- Acumulativo [42154120046](https://github.com/c2melendez/precision-lab-lite/actions/runs/42154120046): **SUCCESS**.
- H1d [42154119972](https://github.com/c2melendez/precision-lab-lite/actions/runs/42154119972): **SUCCESS**.
- Scientific UI [42154120035](https://github.com/c2melendez/precision-lab-lite/actions/runs/42154120035): **SUCCESS**.
- Runner [42154119970](https://github.com/c2melendez/precision-lab-lite/actions/runs/42154119970): **SUCCESS**.
- CI: FAILURE solo npm audit.

## Decisión
PASS_SCOPED bilateral. Sin cambio de producto.
