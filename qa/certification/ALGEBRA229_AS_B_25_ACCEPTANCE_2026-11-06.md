# Algebra229 AS-B-25 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global permanece **OPEN**.

## Contrato congelado
- AS-B-25, N3, `factorizar`.
- Entrada: `x^{2}+1\\ \\text{sobre }\\mathbb{C}`.
- Salida de matriz: `\\left(x - i\\right) \\left(x + i\\right)`.
- Nota: `Sobre ℂ se descompone.`
- Alcance: la factorización compleja se habilita solo con el sufijo explícito `sobre ℂ`; no se infiere para `factor(x^2+1)` sin sufijo.

## Pruebas y oráculos
- Lite `tests/algebra229AsB25.audit.test.ts`: 5/5 PASS. Verifica los siete campos semánticos de la fila congelada, forma ASCII exacta `(x-i)*(x+i)`, equivalencia simbólica, multiplicación compleja independiente en ocho muestras enteras y regresión que impide introducir `i` sin sufijo.
- Plus `backend/tests/test_algebra229_as_b25.py`: 4/4 PASS. Verifica fila congelada, endpoint HTTP `POST /api/v1/factor`, salida ASCII exacta, equivalencia con SymPy, evaluador complejo independiente restringido por AST en ocho muestras y regresión sin sufijo.

## Evidencia Lite — SHA técnico `dbea0c0e5aea6701d327d82ebedb8507fea7bb33`
- Cumulative [42224254086](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254086) SUCCESS; guard `skip=false`, `evidence_run_id=""`; 366/366 archivos, focal 5/5 y 2,263 passed, 8 expected fail, 34 TODO.
- CI [42224254124](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254124) SUCCESS; focal 5/5, 366/366 archivos; `npm audit` sin vulnerabilidades.
- H1d [42224254222](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254222) SUCCESS; 22/22 Playwright.
- Scientific UI [42224254152](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254152) SUCCESS; 456/456 Playwright en desktop, tablet y mobile.
- Runner [42224254110](https://github.com/c2melendez/precision-lab-lite/actions/runs/42224254110) SUCCESS; ejecución push-only de continuidad, no un gate adicional.

## Evidencia Plus — SHA técnico `1da7ecac06ab65c7d377af33ee88479ef6218e9a`
- Cumulative [42224279552](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279552) SUCCESS; guard `skip=false`, `evidence_run_id=""`; frontend/backend SUCCESS, focal 4/4 y backend 2,804 passed, 1 skipped, 10 xfailed.
- CI [42224279542](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279542) SUCCESS; frontend/backend SUCCESS, backend 2,804 passed, 1 skipped, 10 xfailed.
- H1d [42224279507](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279507) SUCCESS; 38/38 Playwright.
- Runner [42224279695](https://github.com/c2melendez/precision-lab-plus/actions/runs/42224279695) SUCCESS; no sustituye los gates anteriores.

## Decisión y límites
- Los logs confirman ejecución real, no REUSE, de los tests focales y de los gates aplicables.
- Los commits técnicos de ambos motores modifican solamente sus tests de certificación; no hubo cambio de producto ni de motor.
- Global **OPEN**. SG28/H2/DIST, SECURITY-S25 y los demás gaps independientes permanecen sin cambio.

Siguiente: AS-B-26, `\\text{factorizar el entero }360` → `2^{3}\\cdot 3^{2}\\cdot 5` (N2). Global **OPEN**.
