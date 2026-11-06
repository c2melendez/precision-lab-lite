# Algebra229 AS-B-10 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-10; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-10, N2, `factorizar`, `x^{3}+3x^{2}+3x+1` → `\left(x + 1\right)^{3}`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`.
- Test: `tests/algebra229AsB10.audit.test.ts`, blob `87114d1cc4949d8ee7655dc76fb6f09037f73fd2`.
- El test coteja las siete celdas de contrato, exige la forma `(x+1)^3` (o `(1+x)^3`), verifica identidad algebraica estructural y valida diez sustituciones enteras con `compileNumeric` y el esperado nativo `x**3+3*x**2+3*x+1`, sin usar Algebrite como oráculo numérico.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `4dc5351126a4761029391360b3fc1cc1a6a49b82`.
- Acumulativo [42151552959](https://github.com/c2melendez/precision-lab-lite/actions/runs/42151552959): **SUCCESS**.
- H1d [42151552846](https://github.com/c2melendez/precision-lab-lite/actions/runs/42151552846): **SUCCESS**, 22/22.
- Scientific UI [42151552832](https://github.com/c2melendez/precision-lab-lite/actions/runs/42151552832): **SUCCESS**.
- Runner [42151552953](https://github.com/c2melendez/precision-lab-lite/actions/runs/42151552953): **FAILURE** en fingerprint (continuity simplificado previo); no bloquea aceptación matemática.
- CI estándar [42151552855](https://github.com/c2melendez/precision-lab-lite/actions/runs/42151552855): **FAILURE** únicamente en npm audit. Gate de seguridad intacto.

## Decisión
AS-B-10 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
