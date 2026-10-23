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
