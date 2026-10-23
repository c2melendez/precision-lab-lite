## 2026-10-23 UTC — r260: EDCX B1 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte B, B1 (49 filas, conversión entre representaciones): 45 PASS_SCOPED + 4 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. No existe motor de variable compleja que cubra
  la conversión B/P/T/X (`abs`, `arg`, `re`, `im`, `topolar` no están
  implementados con esa semántica). No se declara PASS ni FAIL de Lite: gap de
  alcance.
- Plus B1: 45 PASS_SCOPED / 4 BLOCKED. No hay notación polar de entrada
  (`2_{pi/3}` -> `PARSE_ERROR`; `2 angle pi/3` -> `2*pi*angle/3`) ni de salida
  (`topolar(3)=3`, `topolar(-2)=-2`, `topolar(1+i)=(-1)**(1/4)*sqrt(2)`). La
  conversión se certifica con `abs`+`arg` y oráculo sympy que reconstruye las
  formas B/T/X; las 10 filas P usan la traducción documentada
  `r_theta -> r*(cos(theta)+i*sin(theta))`.
- BLOCKED: `B-17` (`arg(0)=0` sin aviso frente a `topolar(0)=DOMAIN_ERROR`) y
  `T-09/T-10/X-12` (formas semángulo simbólicas sin reducir).
- Acumulado EDCX (A + B1): 259 / 638 filas, 138 PASS / 121 BLOCKED.
- Evidencia CI Plus: `a53449db` cumulative [39940618566] / H1d [39940618559]
  **SUCCESS** (2285 passed, 1 skipped, 6 xfailed, cobertura 87.94%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r260.

**Siguiente acción única:** EDCX Parte B, bloque B2 (operaciones, 41 filas) en
Plus; Lite permanece sin motor complejo equivalente.

---

## 2026-10-23 UTC — r259: EDCX A8 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A8 (6 filas, casos límite): 0 PASS / 6 BLOCKED en Plus. Parte A completa: 210 / 638 filas, 93 PASS / 117 BLOCKED.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` no implementa
  análisis de existencia/unicidad, ramas múltiples, intervalo máximo ni
  condiciones de frontera. No se declara PASS ni FAIL de Lite: gap de alcance.
- Plus A8: 0 PASS / 6 BLOCKED. `CL-01/CL-02` comparten el mismo
  `UNSUPPORTED_OPERATION`; `CL-03` devuelve una integral implícita sin ramas;
  `CL-04` evalúa `1/(1-x)` en `x=2` como `-1` sin error de intervalo; `CL-05`
  devuelve solo `-|x|`; `CL-06` se rechaza por el límite de una condición
  inicial, no por incompatibilidad de frontera.
- Parte A completa (A1–A8): 210 / 638 filas, 93 PASS / 117 BLOCKED.
- Evidencia CI Plus: `c3d38972` cumulative [39935820474] / H1d [39935820754]
  **SUCCESS** (2224 passed, 1 skipped, 6 xfailed, cobertura 87.94%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r259.

**Siguiente acción única:** EDCX Parte B, bloque B1 (conversión de formas, 49
filas) en Plus; Lite permanece sin motor complejo equivalente.

---

## 2026-10-23 UTC — r258: EDCX A7 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A7 (25 filas, cualitativo/numérico/retardo): 4 PASS (2 exactos + 2 con alcance) / 21 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` no implementa
  análisis cualitativo, trayectorias ortogonales, iteración de Picard, métodos
  numéricos, recurrencias ni ecuaciones con retardo. No se declara PASS ni FAIL
  de Lite: gap de alcance.
- Plus A7: 2 PASS exactos (`ED-Q-23/24`: `Si(x)` y `sqrt(pi)/2 erf(x)`) + 2
  PASS_SCOPED (`ED-Q-05/06`: solución exacta, intervalo máximo solo derivado con
  oráculo) + 21 BLOCKED (cualitativas, no unicidad, ortogonales, Picard,
  Euler/Heun/RK4, recurrencias, retardo y Riccati).
- Acumulado EDCX A1–A7 en Plus: **204 filas, 93 PASS / 111 BLOCKED**.
- Evidencia CI Plus: `795a97ef` cumulative [39934588535] / H1d [39934588487]
  **SUCCESS** (2217 passed, 1 skipped, 6 xfailed, cobertura 87.90%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r258.

**Siguiente acción única:** EDCX A8 (casos límite, 6 filas) en Plus; Lite permanece
sin motor EDO equivalente.

---

## 2026-10-23 UTC — r257: EDCX A6 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A6 (26 filas, EDP): 1 PASS_SCOPED / 25 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` no implementa EDP,
  clasificación, características, series de Fourier ni núcleo del calor. No se
  declara PASS ni FAIL de Lite: gap de alcance.
- Plus A6: 1 PASS_SCOPED (`ED-P-25`: laplaciano de `e^x sin y` compuesto con dos
  derivadas parciales reales de orden 2 y suma exacta 0) + 25 BLOCKED
  (transporte, Burgers, d'Alembert, cuerda, calor, Laplace/Poisson, autovalores
  con dos fronteras y núcleo del calor).
- Acumulado EDCX A1–A6 en Plus: **179 filas, 89 PASS / 90 BLOCKED**.
- Evidencia CI Plus: `9a828f3c` cumulative [39932526897] / H1d [39932526943]
  **SUCCESS** (2198 passed, 1 skipped, 6 xfailed, cobertura 87.90%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r257.

**Siguiente acción única:** EDCX A7 (cualitativo/numérico/retardo, 25 filas) en
Plus; Lite permanece sin motor EDO/EDP equivalente.

---

## 2026-10-23 UTC — r256: EDCX A5 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A5 (10 filas, series y Frobenius): 8 PASS / 2 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` solo cubre
  `y'=f(x)` y EDO lineales de 2.º orden con coeficientes constantes; no hay
  series, Frobenius ni clasificación de puntos singulares. No se declara PASS ni
  FAIL de Lite: gap de alcance.
- Plus A5: 5 PASS exactos (`ED-F-01..05`: trigonométrica, Airy, Bessel) +
  3 PASS_SCOPED (`ED-F-06..08`: serie truncada de Legendre y polinomios de
  Hermite/Chebyshev por elección de constantes) + 2 BLOCKED (`ED-F-09..10`:
  clasificación de punto singular regular/irregular sin canal).
- Acumulado EDCX A1–A5 en Plus: **153 filas, 88 PASS / 65 BLOCKED**.
- Evidencia CI Plus: `50d9ca03` cumulative [39929466812] / H1d [39929467052]
  **SUCCESS** (2168 passed, 1 skipped, 6 xfailed, cobertura 87.85%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r256.

**Siguiente acción única:** EDCX A6 (EDP, 26 filas) en Plus; Lite permanece sin
motor EDO/EDP equivalente.

---

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
