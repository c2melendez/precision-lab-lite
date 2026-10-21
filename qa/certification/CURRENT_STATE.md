> Decisiones de alcance, de producto y de proceso: ver `qa/certification/ALGEBRA229_DECISIONS.md`.

## 2026-10-21 UTC — AS-B-28 PASS_SCOPED bilateral (continuity r203)

**ALGEBRA229-AS-B-28** — factorizar el entero 4294967297 → `641*6700417` (fila N3). Sintaxis D25: entrada `factor(4294967297)`, salida ASCII exacta.

Evidencia:
- **Lite:** test-first `2f869fa` sin cambio de producto. Gates SUCCESS: cumulative [39541626385](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626385), h1d [39541626256](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626256), scientific-ui [39541626315](https://github.com/c2melendez/precision-lab-lite/actions/runs/39541626315).
- **Plus:** test-first `410f453` rojo; producto `ae70b7c`. Gates SUCCESS: cumulative [39542004229](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004229), h1d [39542004282](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004282), Native Syntax [39542004162](https://github.com/c2melendez/precision-lab-plus/actions/runs/39542004162).

Cierre D20 de r202: Lite `038703f` [39537615093](https://github.com/c2melendez/precision-lab-lite/actions/runs/39537615093)/[39537617379](https://github.com/c2melendez/precision-lab-lite/actions/runs/39537617379)/[39537619338](https://github.com/c2melendez/precision-lab-lite/actions/runs/39537619338); Plus `a2a4968` [39537621754](https://github.com/c2melendez/precision-lab-plus/actions/runs/39537621754)/[39537623963](https://github.com/c2melendez/precision-lab-plus/actions/runs/39537623963)/[39537626336](https://github.com/c2melendez/precision-lab-plus/actions/runs/39537626336). SUCCESS.

Alcance: solo `factor(4294967297)`. Global OPEN. Siguiente: AS-B-29 ON_HOLD.

---

> Nota: el historial completo de AS-B-01..27 permanece en el commit técnico previo `2f869fa` y en el historial de la rama. `continuity.json` r203 es la fuente de next_action.
