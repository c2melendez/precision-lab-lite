# Actualización de certificación — 2026-11-13 UTC (r507; TRIG-EC-HI-02 test-first Lite freeze SUCCESS; siguiente Plus)

Global **OPEN**. Ningún gate cancelado o saltado cuenta como PASS.

Contrato congelado: fuente gzip blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`, sección 2.D.

### TRIG-EC-HI-01 — PASS_SCOPED bilateral (`arsinh x = 1` → `x = sinh 1 ≈ 1.175201194`)

**Lite**
- Test-first `tests/trigonometryEcHi01.audit.test.ts` (ancla fuente + oráculo exacto sinh(1) + numérico).
- Corrección de producto en el solver para devolver exactamente sinh(1). SHA técnico `bc03aebb6b998b3018ba20c1cb3a681cf184ecb5`.
- Gates: CI 43367477517 SUCCESS, IN625 Cumulative 43367477566 SUCCESS, H1d 43367477582 SUCCESS, Syntax309 SY-N-31 E2E 43367477665 SUCCESS, Certification Runner 43367477633 SUCCESS.

**Plus**
- Test-first `backend/tests/test_trigonometry_ec_hi01.py` (servicio + HTTP contract + oráculo simbólico).
- SHA de test `ebafdb71bfce721b9b6e8a673128672b17a2f32d`; producto ya soportaba o se ajustó. Gates funcionales SUCCESS (Cumulative 43367115820, CI 43367116021, H1d 43367115781). HEAD posterior de seguridad `e997e834` también SUCCESS en Cumulative/CI/H1d/security.

### TRIG-EC-HI-02 — in progress (`arcosh x = 0` → `x = 1`)

**Lite**
- Test-first freeze `tests/trigonometryEcHi02.audit.test.ts` (ancla fuente + oráculo exacto 1).
- Certification Runner 43509891765 SUCCESS on commit `74fc0d8a94cbd3b58ae80f7b56671e8ce073e661`.
- Producto ya soporta el resultado exacto (no se requirió corrección).

**Plus**
- Pendiente: añadir test-first equivalente en `backend/tests/`.

### Decisión

- **TRIG-EC-HI-01** queda **PASS_SCOPED bilateral**.
- **TRIG-EC-HI-02** Lite side test-first freeze SUCCESS; Plus pendiente.
- Certificación global sigue **OPEN** (EV-D-01 BLOCKED; S25/mutación con evidencia puntual; SG28/H2 OPEN; DIST-01..08 BLOCKED).

### Siguiente acción única

Añadir test-first bilateral restante en **Plus** para **TRIG-EC-HI-02** anclado a la fila original (sección 2.D):

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-HI-02 | `arcosh x = 0` | `x = 1` |

Corregir producto solo donde el fallo lo demuestre. No saltar a HI-03.

---
