# Acta de aceptación — TRIG-EC-D-06

<badge>PASS_SCOPED bilateral</badge>

## Contrato congelado

Fuente: \`qa/certification/legacy_sources/ejercicios_trigonometria.md.gz\`, blob \`3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb\`.

Fila original (tres columnas; no existe columna independiente de nota):

\[
\sin(2x)=\cos(x),\qquad x\in[0,2\pi)
\]

Conjunto esperado y certificado:

\[
\left\{\frac{\pi}{6},\frac{\pi}{2},\frac{5\pi}{6},\frac{3\pi}{2}\right\}
\]

La prueba exige exactamente cuatro raíces distintas, verifica su pertenencia al intervalo semiabierto y sustituye cada una en la ecuación original.

## Evidencia Lite

SHA técnico: \`2af7cefc410d1b7cb2c15483f3affd3473b54a89\`.

- Test \`tests/trigonometryEcD06.audit.test.ts\`: 2/2 PASS en CI y Cumulative.
- [Cumulative 42746381569](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381569) SUCCESS; 399 test files, 2,408 passed, 8 expected fail, 34 TODO. Guard \`skip=false\`, \`evidence_run_id=""\`.
- [CI 42746381637](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381637) SUCCESS; typecheck, dependency audit, unit/parity y build SUCCESS; 399 test files, 2,408 passed, 8 expected fail, 34 TODO.
- [H1d 42746381850](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381850) SUCCESS, 22/22; guard \`skip=false\`.
- [Scientific UI 42746381589](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381589) SUCCESS, 456/456 (desktop/tablet/mobile); guard \`skip=false\`, \`evidence_run_id=""\`.
- [Runner 42746381595](https://github.com/c2melendez/precision-lab-lite/actions/runs/42746381595) SUCCESS, push-only; no dispatch manual.

Implementación: helper estrictamente acotado en \`src/engine/stepEngine/trigonometricEquation.ts\` y enrutamiento en \`src/engine/stepEngine/algebra.ts\`. Aplica la identidad \(\sin(2x)=2\sin(x)\cos(x)\), factoriza \(\cos(x)(2\sin(x)-1)=0\), resuelve cada factor con las rutas trigonométricas existentes, reúne las raíces y las verifica contra la ecuación original. No constituye un resolvedor genérico de ecuaciones trigonométricas mixtas.

## Evidencia Plus

SHA técnico: \`2a7ff0f2b243597ef6476e665b4a102dcfffdd85\`.

- Test \`backend/tests/test_trigonometry_ec_d06.py\`: ambos casos PASSED explícitamente en el job backend de Cumulative: anclaje de fuente y POST \`/api/v1/solve\` con las cuatro raíces exactas.
- [Cumulative 42746666257](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666257) SUCCESS; backend 2,933 passed, 1 skipped, 11 xfailed; guard \`skip=false\`, \`evidence_run_id=""\`.
- [CI 42746666105](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666105) SUCCESS; backend 2,933 passed, 1 skipped, 11 xfailed; frontend SUCCESS.
- [H1d 42746666095](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666095) SUCCESS, 38/38; guard \`skip=false\`.
- [Native Syntax 42746666542](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666542) SUCCESS, 52/52 (desktop/tablet/mobile); guard \`skip=false\`, sin reutilización.
- [Runner 42746666546](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666546) SUCCESS, push-only; no dispatch manual.

Corrección técnica previa a la aceptación: el primer intento de prueba-only devolvió \(-\pi/2\), una raíz equivalente pero fuera de la representación del intervalo congelado. El helper acotado en \`backend/app/services/solve_service.py\` resuelve los factores sobre \([0,2\pi)\) y devuelve \(3\pi/2\), además de las otras tres raíces. El SHA de ese intento inicial no se utiliza como evidencia de aceptación.

## Alcance y límites

- PASS_SCOPED cubre solamente \(\sin(2x)=\cos(x)\), sus cuatro raíces exactas y el intervalo \([0,2\pi)\).
- Las entradas de cálculo usan ASCII/forma normalizada; la fila fuente se ancla como fixture. No se certifica aquí la ingesta literal LaTeX en Plus \`/api/v1/evaluate\`.
- No se afirma una solución general sobre toda \(\mathbb{R}\) ni se generaliza el helper Lite/Plus a otras combinaciones trigonométricas.
- La corrida independiente de seguridad/mutación Plus [42746666307](https://github.com/c2melendez/precision-lab-plus/actions/runs/42746666307) seguía IN_PROGRESS en \`plus-backend-mutmut\` al documentar. No forma parte del oráculo matemático EC-D-06 y no se contabiliza como aprobada.
- Certificación global: **OPEN**. EV-D-01 Plus \`/api/v1/evaluate\` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.

## Siguiente objetivo

TRIG-EC-D-07. La fila congelada siguiente es \(\csc(x)=2,\ x\in[0,2\pi)\), con resultado esperado \(\{\pi/6,5\pi/6\}\). La fuente tiene tres columnas y no tiene una nota separada. Fijar ese contrato y continuar test-first bilateral; no repetir EC-D-01..06.

