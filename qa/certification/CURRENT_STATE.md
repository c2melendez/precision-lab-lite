# Actualización de certificación — 2026-11-13 UTC (r505; TRIG-EC-H-09 y TRIG-EC-H-10 PASS_SCOPED bilateral; siguiente EC-HI-01)

Global **OPEN**. Ningún gate cancelado o saltado cuenta como PASS.

Contrato congelado: fuente gzip blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`, sección 2.C.

### TRIG-EC-H-09 — PASS_SCOPED bilateral (`cosh x = 1/2` → sin solución real)

**Lite**
- Test-first + helper `hyperbolicCoshBelowOneStep`; SHA técnico de producto integrado en el núcleo modular.
- Gates sobre HEAD de cierre `70926ea174023ac708719b94f5cfe6502a4cab9c`: CI 43343503689 SUCCESS, IN625 Cumulative 43343503751 SUCCESS, H1d 43343503797 SUCCESS, Syntax309 SY-N-31 E2E 43343503702 SUCCESS, Certification Runner 43343503801 SUCCESS.

**Plus**
- Helper `_hyperbolic_cosine_below_one_contradiction` en `solve_service.py` (SHA técnico 49211e6a y sucesores).
- Gates funcionales SUCCESS en el ciclo H-09; mutación de seguridad 43278092626 SUCCESS.

### TRIG-EC-H-10 — PASS_SCOPED bilateral (`tanh x = 2` → sin solución real)

**Lite**
- Test-first `tests/trigonometryEcH10.audit.test.ts` (ancla fuente + oráculo de rango `|tanh| < 1` con tolerancia IEEE).
- Helper `hyperbolicTangentOutOfRangeStep`; oráculo float-saturation corregido (`Math.abs(value) < 1 + 1e-10`).
- HEAD técnico de cierre `70926ea1`: Cumulative 43343503751 SUCCESS, CI 43343503689 SUCCESS, H1d SUCCESS, E2E SUCCESS.

**Plus**
- Test-first `backend/tests/test_trigonometry_ec_h10.py`.
- Helper de rango + wiring en `solve_equation` (SHA `521c117c5a449e03ba76c67dd1a5b623ed455d0e`).
- Cumulative 43318991768 SUCCESS, CI 43318991878 SUCCESS, H1d 43318992258 SUCCESS, Native Syntax 43318991817 SUCCESS, Runner 43318991782 SUCCESS.

### Notas de ingeniería (Lite)

Durante H-10 el cuerpo monolítico de `algebra.ts` se modularizó (`algebraSolveCore.ts`, `algebraUtils.ts`, helpers hiperbólicos) por límites de payload de herramientas. Se restauraron paths de identidad/contradicción, dominio racional, raíz cuadrada simbólica (AS-PAR-06/07) y valor absoluto simbólico (AS-PAR-08/09) para no regresar regresiones Algebra114. El Cumulative final cubre tanto H-10 como esas restauraciones.

### Decisión

- **TRIG-EC-H-09** y **TRIG-EC-H-10** quedan **PASS_SCOPED bilateral**.
- Serie EC-H (ecuaciones hiperbólicas 01–10) de la matriz congelada completada en ambos motores.
- Certificación global sigue **OPEN** (EV-D-01 BLOCKED; S25/mutación con evidencia puntual; SG28/H2 OPEN; DIST-01..08 BLOCKED).

### Siguiente acción única

Iniciar test-first bilateral **TRIG-EC-HI-01** anclado a la fila original (sección 2.D):

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-HI-01 | `arsinh x = 1` | `x = sinh 1 ≈ 1.175201194` |

Añadir tests de fuente y solver/API en Lite y Plus; corregir producto solo donde el fallo lo demuestre. No saltar a HI-02.

---
