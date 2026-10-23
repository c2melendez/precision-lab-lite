## 2026-10-23 UTC — r264: registro gates r263 — Lite success

- r264: gates r263 Lite en success: cumulative 40015124636, H1d 40015127464, scientific-ui 40015130309 sobre 61f438d2.
- Plus/Lite B4 mantienen la clasificación de r263; no se toca producto.
- Siguiente: EDCX-B5 READY, no iniciado.

---

## 2026-10-23 UTC — r263: EDCX B4 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `7f5f69be`); no se ejecutó B4.
- Plus `7e501f5` (test-first) y `177955d` (cierre docs): B4 medido en 34 filas -> 14 PASS / 14 PASS_SCOPED / 4 FAIL / 2 BLOCKED.
- Siguiente: EDCX-B5 READY, no iniciado.

---

## 2026-10-23 UTC — r262: EDCX B3 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó B3.
- Plus `ab220425`: cumulative [39945613218] SUCCESS — 2345 passed, 1 skipped,
  6 xfailed, cobertura 87.92%; H1d [39945613228] SUCCESS. Harness B3 22/22.
- B3: 19 filas -> 7 PASS exactos + 10 PASS_SCOPED / 2 BLOCKED. `evaluate`
  resuelve potencias enteras y negativas exactas; `sqrt`/`root` devuelven solo
  la raíz principal; `/solve` sobre `z^n=w` enumera todas las raíces.
- PASS_SCOPED: `VC-PR-07..16` por la ruta `/solve` (`z^4=-4 -> ±1±i`,
  `z^3=8 -> 2, -1±i√3`, `z^6=1` en seis radicales cartesianos).
- BLOCKED: `VC-PR-17` (sin nodo de sumatoria) y `VC-PR-18` (sin producto de
  raíces).
- Hallazgos: `sqrt(i)` -> `sqrt(I)` sin simplificar; `(-8)^(1/3)` ->
  `2*(-1)**(1/3)`, no `-2`.
- Acumulado EDCX (A + B1 + B2 + B3): 319 / 638 filas, 188 PASS / 131 BLOCKED.
- Siguiente: EDCX Parte B, bloque B4 (ecuaciones en C, 34 filas).

---

## 2026-10-23 UTC — r261: EDCX B2 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó B2.
- Plus `7c87b95f`: cumulative [39943293295] SUCCESS — 2323 passed, 1 skipped,
  6 xfailed, cobertura 87.96%; H1d [39943293116] SUCCESS. Harness B2 38/38.
- B2: 41 filas -> 20 PASS exactos + 13 PASS_SCOPED / 8 BLOCKED. La forma
  binómica se evalúa literalmente, incluida la multiplicación implícita; las
  nueve entradas `r_{theta}` devuelven `PARSE_ERROR`.
- PASS_SCOPED: `P-01..P-09` (traducción y salida binómica/raíz), `T-05` (Euler),
  `X-04` (potencia principal en forma de raíz), `X-08` y `X-09` (equivalentes
  exactos con parámetros reales).
- BLOCKED: `T-04/X-10` (potencia sin combinar), `T-06/T-07/T-08` (sin expansión
  de ángulo múltiple), `T-09` (sin sumatoria) y `X-11/X-12` (sin media ángulo ni
  serie geométrica).
- Hallazgo: `cos3theta` es un símbolo libre, no `cos(3*theta)`.
- Acumulado EDCX (A + B1 + B2): 300 / 638 filas, 171 PASS / 129 BLOCKED.
- Siguiente: EDCX Parte B, bloque B3 (potencias y raíces, 19 filas).

---

## 2026-10-23 UTC — r260: EDCX B1 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó B1.
- Plus `a53449db`: cumulative [39940618566] SUCCESS — 2285 passed, 1 skipped,
  6 xfailed, cobertura 87.94%; H1d [39940618559] SUCCESS. Harness B1 61/61.
- B1: 49 filas -> 45 PASS_SCOPED / 4 BLOCKED. Sin notación polar de entrada ni
  de salida; la conversión se certifica con `abs`+`arg` y oráculo sympy. Las 10
  filas P requieren la traducción `r_theta -> r*(cos+i*sin)`.
- BLOCKED: `B-17` (`arg(0)=0` sin aviso frente a `topolar(0)=DOMAIN_ERROR`) y
  `T-09/T-10/X-12` (formas semángulo simbólicas sin reducir).
- Acumulado EDCX (A + B1): 259 / 638 filas, 138 PASS / 121 BLOCKED.
- Siguiente: EDCX Parte B, bloque B2 (operaciones, 41 filas).

---

## 2026-10-23 UTC — r259: EDCX A8 y cierre Parte A (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó A8.
- Plus `c3d38972`: cumulative [39935820474] SUCCESS — 2224 passed, 1 skipped,
  6 xfailed, cobertura 87.94%; H1d [39935820754] SUCCESS. Harness A8 7/7.
- A8: 6 filas -> 0 PASS / 6 BLOCKED (no unicidad indistinguible, integral
  implícita sin ramas, intervalo máximo no aplicado, rama singular única y
  frontera incompatible rechazada por el límite de una condición inicial).
- Parte A completa en Plus (A1–A8): 210 / 638 filas, 93 PASS / 117 BLOCKED.
- Siguiente: EDCX Parte B, bloque B1 (conversión de formas, 49 filas).

---

## 2026-10-23 UTC — r258: EDCX A7 mirror (Lite NO_EJECUTADO)

- Lite sin cambios técnicos (baseline `40b000b8`); no se ejecutó A7.
- Plus `795a97ef`: cumulative [39934588535] SUCCESS — 2217 passed, 1 skipped,
  6 xfailed, cobertura 87.90%; H1d [39934588487] SUCCESS. Harness A7 19/19.
- A7: 25 filas -> 2 PASS exactos (`ED-Q-23/24`) + 2 PASS_SCOPED (`ED-Q-05/06`:
  intervalo máximo solo por oráculo) + 21 BLOCKED (sin canal cualitativo,
  numérico, recurrencias ni retardo).
- Acumulado EDCX A1–A7 en Plus: 204 filas, 93 PASS / 111 BLOCKED.
- Siguiente: EDCX A8 (casos límite, 6 filas) en Plus.

---

## 2026-10-23 UTC — r257: EDCX A6 (Plus scoped; Lite sin ejecución)

- Lite `11d79a37`: sin cambios técnicos; espejo documental de r257.
- Plus `9a828f3c` (A6): cumulative [39932526897] y H1d [39932526943] SUCCESS;
  2198 passed, 1 skipped, 6 xfailed, cobertura 87.90%. Harness A6 30/30.
- A6: 1 PASS_SCOPED (`ED-P-25`, laplaciano compuesto con derivadas parciales
  reales y suma exacta 0) + 25 BLOCKED (sin motor de EDP).
- Lite **NO_EJECUTADO**: el motor ODE no cubre EDP, clasificación,
  características, Fourier ni núcleo del calor. Sin PASS/FAIL bilateral.
- Siguiente: EDCX A7 (cualitativo/numérico/retardo, 25 filas) en Plus.

---

## 2026-10-23 UTC — r256: EDCX A5 (Plus scoped; Lite sin ejecución)

- Lite `2fc34002`: sin cambios técnicos; espejo documental de r256.
- Plus `50d9ca03` (A5): cumulative [39929466812] y H1d [39929467052] SUCCESS;
  2168 passed, 1 skipped, 6 xfailed, cobertura 87.85%. Harness A5 11/11.
- A5: 5 PASS exactos + 3 PASS_SCOPED + 2 BLOCKED.
- Lite **NO_EJECUTADO**: el motor ODE no cubre series, Frobenius ni clasificación
  de puntos singulares. Sin PASS/FAIL bilateral.
- Siguiente: EDCX A6 (EDP, 26 filas) en Plus.

---

## 2026-10-23 UTC — r255: EDCX A3+A4 (Plus scoped; Lite sin ejecución)

- Lite `36319b4a`: sin cambios técnicos; espejo documental de r255.
- Plus `6aef2571` (A3): cumulative [39926515965] y H1d [39926515979] SUCCESS;
  2130 passed, 1 skipped, 6 xfailed, cobertura 87.92%. Harness A3 17/17.
- Plus `02e198ac` (A4): cumulative [39927284848] y H1d [39927284862] SUCCESS;
  2157 passed, 1 skipped, 6 xfailed, cobertura 87.85%. Harness A4 27/27.
- A3: 3 PASS_SCOPED + 13 BLOCKED; A4: 1 PASS + 23 BLOCKED.
- Lite **NO_EJECUTADO**: el motor ODE no cubre sistemas, `expm`, Laplace,
  integrales ni series. Sin PASS/FAIL bilateral.
- Defecto confirmado en Plus: la segunda condición inicial con `;` no está
  implementada (`PARSE_ERROR` medido); no se corrige en r255.
- Siguiente: EDCX A5 (series / Frobenius, 10 filas) en Plus.

---

## 2026-10-23 UTC — r254: EDCX A1+A2 PASS_SCOPED (Plus); Lite sin ejecución

- Lite `40b000b8` (MV-J): cumulative [39914455096] SUCCESS — catálogo MV cerrado.
- EDCX A1 (53) + A2 (50) en Plus `fdcf2d63`: 76 PASS / 27 BLOCKED; cumulative
  [39924322798] SUCCESS (backend 2113 passed, cobertura 87.92%) y H1d
  [39924322809] SUCCESS.
- Regresión `86241e40` (`mp.pool.Pool` sin importar el submódulo) corregida en
  `5a76477a`; los runs fallidos no se usan como evidencia.
- Lite: A1/A2 NO_EJECUTADO (gap de alcance de `stepEngine/ode.ts`). Sin PASS ni
  FAIL bilateral.
- Siguiente: EDCX A3 (16 filas) en Plus.

---

## 2026-10-23 UTC — r246: cierre formal MV-D-01..17 PASS_SCOPED_BILATERAL

- Producto Lite ya verificado en `c28091c` (cumulative/h1d/scientific-ui SUCCESS).
- Campaña Plus S25/S19 CLEAR (39890525978, 39899659414).
- Cierre documental bilateral; siguiente objetivo MV-E.
