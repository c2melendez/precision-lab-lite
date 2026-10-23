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
