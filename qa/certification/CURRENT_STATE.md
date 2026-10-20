## 2026-10-20 UTC — AS-B-07: Plus PASS, Lite FAIL_PRODUCT (continuity r172)

**ALGEBRA229-AS-B-07** — factorizar `x^{6}-1` → `\left(x - 1\right) \left(x + 1\right) \left(x^{2} - x + 1\right) \left(x^{2} + x + 1\right)` (fila fuente N2 en la matriz congelada Section B).

| Repo | Technical SHA | Gates | Conclusion |
|------|---------------|-------|------------|
| Lite | `6bafda356a53aba542cd37a0bc1547397c424a2d` | cumulative [39433167930](https://github.com/c2melendez/precision-lab-lite/actions/runs/39433167930) **failure**; scientific-ui [39433167821](https://github.com/c2melendez/precision-lab-lite/actions/runs/39433167821) success; h1d [39433168379](https://github.com/c2melendez/precision-lab-lite/actions/runs/39433168379) success | FAIL_PRODUCT |
| Plus | `da361aee09728e0e0525e43615b6418b4ec9fb14` | cumulative [39433181526](https://github.com/c2melendez/precision-lab-plus/actions/runs/39433181526) success; h1d [39433181543](https://github.com/c2melendez/precision-lab-plus/actions/runs/39433181543) success | SUCCESS |

**Clasificación (producto, Lite):** `factor(x^6-1)` en el motor Algebrite devuelve `(x-1)*(x+1)*(x^2+x+1)*(x^2+1)`. No es equivalente al original: `expand(factor) = x^6+x^5+x^4-x^2-x-1`, y la diferencia con `x^6-1` es `x^5+x^4-x^2-x`. El factor correcto es `x^2-x+1`. La prueba `tests/algebra229AsB07.audit.test.ts` falla en la segunda aserción, la de igualdad con el original; la fila fuente y la forma factorizada pasan. Es una factorización incorrecta devuelta como éxito. Plus no tiene el problema porque usa SymPy.

**Estado:** la corrección requiere un cambio de algoritmo en el motor de Lite (verificación de la factorización con un método de respaldo general). Pendiente de decisión antes de implementar. No se cambió producto en esta pasada.

Bloqueos sin cambio: H2-SG28-DIST-01..08, SECURITY-S25, SY-P-23, SY-X-04-PLUS-HTTP. Global **OPEN**.

**Nota de proceso:** los filtros `paths` de push/PR de cumulative y H1d no excluyen `qa/certification/CONTINUITY_NEXT_ACTION.json`; en commits documentales actualizar solo `continuity.json` y `.md` (ese JSON es un espejo no vinculante, quedó en r160).
