## 2026-10-23 UTC — r255: EDCX A3+A4 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A3 (16 filas) + A4 (24 filas): 4 PASS / 36 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` solo cubre
  `y'=f(x)` y EDO lineales de 2.º orden con coeficientes constantes; no hay
  sistemas, exponencial matricial, Laplace, ecuaciones integrales ni series.
  No se declara PASS ni FAIL de Lite: gap de alcance.
- Plus A3: 3 PASS_SCOPED (`ED-M-11..13`, autovalores exactos por
  `/matrix/eigen`) + 13 BLOCKED (sistemas, `expm`, no lineales/Lyapunov).
- Plus A4: 1 PASS (`ED-T-17` con `t -> x`, residuo + condición inicial) +
  23 BLOCKED (`laplace`/`ilaplace`, convolución, dos condiciones iniciales,
  integrales, sistema).
- Acumulado EDCX A1–A4 en Plus: **143 filas, 80 PASS / 63 BLOCKED**.
- Defecto confirmado en Plus (no corregido): la segunda condición inicial con
  `;` documentada en `_parse_initial_condition` no está implementada.
- Evidencia CI Plus: `6aef2571` cumulative [39926515965] / H1d [39926515979]
  **SUCCESS**; `02e198ac` cumulative [39927284848] / H1d [39927284862]
  **SUCCESS** (2157 passed, 1 skipped, 6 xfailed, cobertura 87.85%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r255.

**Siguiente acción única:** EDCX A5 (series / Frobenius, 10 filas) en Plus;
Lite permanece sin motor EDO equivalente.

---

## 2026-10-23 UTC — r254: EDCX A1+A2 — PASS_SCOPED en Plus; Lite NO_EJECUTADO

**EDCX Parte A, A1 (53 filas) + A2 (50 filas): 76 PASS / 27 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` solo cubre `y'=f(x)`
  y EDO lineales de 2.º orden con coeficientes constantes; no hay separables,
  lineales con factor integrante, Bernoulli, Riccati, Clairaut/Lagrange ni
  Wronskianos. No se declara PASS ni FAIL de Lite: gap de alcance.
- Plus: A1 47 PASS / 6 BLOCKED (ED-L-12 canal `x(y)`; ED-X-02/X-03, ED-B-09,
  ED-C-02, ED-C-05 acotados); A2 29 PASS / 21 BLOCKED (orden>2, dos condiciones
  iniciales, `yy''=y'^2`, celdas `exp/log` en el parser de matrices).
- Detalle completo y evidencia CI en el repo Plus, r254:
  `CURRENT_STATE.md`, `EXECUTION_LOG.md`, `MANUAL_CAPABILITY_GAPS.md`.
- Contexto Lite: el catálogo MV se cerró en `40b000b8` (MV-J, cumulative
  [39914455096](https://github.com/c2melendez/precision-lab-lite/actions/runs/39914455096)
  **SUCCESS**); las revisiones documentales r249–r253 se mantuvieron en Plus.

**Siguiente acción única:** EDCX A3 (sistemas y exponencial matricial, 16 filas)
en Plus; Lite permanece sin motor EDO equivalente.

---

## 2026-10-23 UTC — r248: MV-E-01..12 PASS_SCOPED_BILATERAL

**MV-E-01..12 (rango, núcleo, Col, rango–nulidad) — PASS_SCOPED_BILATERAL.**

### Producto Lite

- `rank()` en `src/engine/matrixOps.ts`
- `nullspace()` / `columnspace()` en `src/engine/matrixSpaces.ts` (rref exacto, Fraction)
- Suite: `tests/matricesMvE01to12.audit.test.ts`
- HEAD: `4f2abd932c3714318f8ffaef2aa6199d36c33de6`
- cumulative [39905437848](https://github.com/c2melendez/precision-lab-lite/actions/runs/39905437848) **SUCCESS**

### Producto Plus (paridad)

- `/matrix/rank` (allow_symbolic), `/matrix/nullspace`, `/matrix/columnspace`
- cumulative [39904542863](https://github.com/c2melendez/precision-lab-plus/actions/runs/39904542863) **SUCCESS** @ `544d8bd`

**Siguiente acción única:** **MV-F** (siguiente sección de `matriz_matrices_vectores.md.gz`).

---

## 2026-10-23 UTC — r246: MV-D-01..17 PASS_SCOPED_BILATERAL

SHA técnico Lite `c28091c`; gates cumulative/h1d/scientific-ui SUCCESS. Campaña S25/S19 CLEARED en Plus.
