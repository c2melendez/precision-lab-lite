# Algebra229 AS-B-13 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-13.

## Contrato y fuente
- Fila congelada: AS-B-13, N3, `factorizar`, `2x^{3}-x^{2}-13x-6` → `\left(x - 3\right) \left(x + 2\right) \left(2 x + 1\right)`.
- Test: `tests/algebra229AsB13.audit.test.ts`, blob `bf8b8067f9c47398f6b3bc5c7d0ada9321e2bcec`.
- Celdas exactas + identidad algebraica + 10 sustituciones enteras independientes.

## Evidencia SHA Lite `51fbb68f427144272db4c0d9cc5e17ba1c9ff7cb`
- Acumulativo [42154684011](https://github.com/c2melendez/precision-lab-lite/actions/runs/42154684011): **SUCCESS**.
- H1d [42154684263](https://github.com/c2melendez/precision-lab-lite/actions/runs/42154684263): **FAILURE** en Install Playwright (flake infra npm; no contenido del test). Mismo patrón que AS-B-12 Plus.
- Scientific UI [42154684170](https://github.com/c2melendez/precision-lab-lite/actions/runs/42154684170): **SUCCESS**.
- Runner [42154684124](https://github.com/c2melendez/precision-lab-lite/actions/runs/42154684124): **SUCCESS**.
- CI: FAILURE solo npm audit.

## Decisión
PASS_SCOPED bilateral. El fallo H1d es infraestructura (Playwright install), no del oráculo ni de la factorización. Cumulative (tests unitarios) y Scientific UI verdes. Sin cambio de producto.
