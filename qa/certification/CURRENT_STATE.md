## 2026-10-20 UTC — AS-A-17 PASS_SCOPED bilateral; sección A completa (continuity r165)

**ALGEBRA229-AS-A-17** — expand `(2x-y)^{5}` → `32 x^{5} - 80 x^{4} y + 80 x^{3} y^{2} - 40 x^{2} y^{3} + 10 x y^{4} - y^{5}` (fila fuente N2 en la matriz congelada Section A; cada coeficiente es un número combinatorio por una potencia de 2).

| Repo | Technical SHA | Gates (todos SUCCESS sobre el SHA exacto, evento push) | Conclusion |
|------|---------------|--------------------------------------------------------|------------|
| Lite | `72bf8e05351ee34b084c3c119557369d2ddcc488` | cumulative [39422323741](https://github.com/c2melendez/precision-lab-lite/actions/runs/39422323741), scientific-ui [39422323909](https://github.com/c2melendez/precision-lab-lite/actions/runs/39422323909), h1d [39422323671](https://github.com/c2melendez/precision-lab-lite/actions/runs/39422323671) | SUCCESS |
| Plus | `795afd0d414eac924a6b6ef5616fb0903187dd6c` | cumulative backend+frontend [39422333606](https://github.com/c2melendez/precision-lab-plus/actions/runs/39422333606), h1d [39422333812](https://github.com/c2melendez/precision-lab-plus/actions/runs/39422333812) | SUCCESS |

Evidencia: `tests/algebra229AsA17.audit.test.ts` (fila fuente; expansión con diferencia exacta cero frente al oráculo, muestras numéricas y ausencia de la potencia) y `backend/tests/test_algebra229_as_a17.py` (servicio HTTP con `2*x-y`). Los gates corren los directorios completos de tests. Verificado por conclusión de runs vía API.

Hallazgo: la prueba test-first pasó en el primer push en ambos repos; no hubo cambio de producto. Sección A (17 filas) completa con PASS_SCOPED en ambos repos.

**Siguiente único:** `ALGEBRA229-AS-B-01-TEST-FIRST` — factorizar `x^{2}-5x+6` → `\left(x - 3\right) \left(x - 2\right)` (N1) según la matriz congelada Section B (`qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`). Sección B tiene 30 filas (AS-B-01..30).

Bloqueos sin cambio: H2-SG28-DIST-01..08, SECURITY-S25, SY-P-23, SY-X-04-PLUS-HTTP. Global **OPEN**.

**Nota de proceso:** los filtros `paths` de push/PR de cumulative y H1d no excluyen `qa/certification/CONTINUITY_NEXT_ACTION.json`; en commits documentales actualizar solo `continuity.json` y `.md` (ese JSON es un espejo no vinculante, quedó en r160).
