# S26.1 — Mapeo de evidencia visual ↔ pruebas funcionales

Proyecto: **Precision Lab Lite**

| Área S26 | Baseline visual | Prueba(s) funcional(es) asociadas |
|---|---|---|
| Shell / navegación | `e2e/s26-baseline.spec.ts` | `e2e/smoke.spec.ts`, `e2e/modules-responsive.spec.ts` |
| Científica | `e2e/s26-baseline.spec.ts` | `e2e/exhaustive-module02-algebra.spec.ts`, `e2e/exhaustive-module03-calculus.spec.ts`, `e2e/s16-critical-regressions.spec.ts` |
| Matrices | `e2e/s26-baseline.spec.ts` | `e2e/exhaustive-module06-matrices.spec.ts` |
| Gráficas | `e2e/s26-baseline.spec.ts` | `e2e/exhaustive-module09-graphing.spec.ts`, `e2e/graph-palette-rendering-m35.spec.ts` |
| Estadística | `e2e/s26-baseline.spec.ts` | `e2e/exhaustive-module07-statistics.spec.ts` |
| Unidades | `e2e/s26-baseline.spec.ts` | `e2e/exhaustive-module08-units.spec.ts` |
| Historial | `e2e/s26-baseline.spec.ts` | `e2e/history-persistence-m28.spec.ts` |
| Teclado | `e2e/s26-baseline.spec.ts` | `e2e/exhaustive-module10-keyboard.spec.ts`, `e2e/keyboard.spec.ts`, `e2e/keyboard-v5-responsive.spec.ts`, `e2e/keyboard-long-press-m36.spec.ts` |
| Layouts | `e2e/s26-baseline.spec.ts` | `e2e/exhaustive-module11-layout-responsive.spec.ts`, `e2e/keyboard-layouts.spec.ts`, `e2e/floating-breakpoint-transition-m37.spec.ts` |
| Ajustes/persistencia | `e2e/s26-baseline.spec.ts` | `e2e/exhaustive-module12-personalization-a11y.spec.ts`, `e2e/settings-persistence-m33.spec.ts`, `e2e/system-preferences-live-m34.spec.ts` |
| Accesibilidad | capturas S26 | `e2e/accessibility.spec.ts`, `e2e/s23-accessibility.spec.ts` |
| Robustez | N/A | `e2e/s20-performance-robustness.spec.ts` |

## Regla

Una fila de `VISUAL_MATRIX.md` solo podrá pasar a PASS cuando:
1. exista captura/baseline del estado;
2. el test funcional asociado pase sobre el mismo SHA o un SHA posterior sin cambios funcionales;
3. no exista una discrepancia runtime pendiente para esa superficie.
