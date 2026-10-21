# Reconciliación documentación ↔ GitHub Actions — 2026-10-21 (r233)

Contrasta lo afirmado en `CURRENT_STATE.md`, `EXECUTION_LOG.md`, `continuity.json`,
`GLOBAL_CERTIFICATION_DASHBOARD.md`, `CONTINUITY.md`, `MANUAL_CAPABILITY_GAPS.md`,
`SY_P_23_CONVENTION.md` y `EXECUTION_LOG_AS229_SECTION_A.md` (ambos repos) contra
los datos reales de GitHub Actions. Aplica a `precision-lab-lite` y
`precision-lab-plus`, rama `qa/syntax-audit-in625-a1`.

## 1. Método

1. Extracción de **477 citas fuertes** de runs (URL `actions/runs/<id>` o `[<id>]`)
   y de **197 SHA completos** (40 hex) presentes en la documentación.
2. Consulta a la API por cada run citado: existencia, repositorio, `head_sha`,
   workflow, `run_attempt` y conclusión. Si un run no existe en el repo del
   documento, se busca en el repo par (documentación bilateral).
3. Consulta por `head_sha` de cada SHA documentado para obtener **todos** sus runs,
   no solo los citados (detección de omisiones y de fallos ocultos).
4. Descarga de logs de los gates acumulativos de los cierres r229–r232 para
   comparar los conteos declarados con los reales.
5. Consulta por `head_sha` de los commits documentales para verificar las
   afirmaciones de "0 corridas".

## 2. Resultado global

| Comprobación | Resultado |
| --- | --- |
| Citas de runs con URL/ID | 477 |
| Runs inexistentes (404 en ambos repos) | **0** |
| SHA completos documentados | 197 |
| SHA documentados sin ningún run | **0** |
| Citas que resuelven en el repo par | 297 (documentación bilateral esperada) |
| Casos "SUCCESS" documentado sobre un run fallido | **0** |
| Fallos ocultos en los cierres r229–r232 | **0** |
| Runs con `run_attempt > 1` citados como gate | 0 (todos attempt=1) |

## 3. Cierres r229–r232: gates y conteos

Conjunto de runs por SHA idéntico al documentado en todos los casos; todos
`SUCCESS`, `attempt=1`. Conteos extraídos de los logs:

| Cierre | Repo | SHA | Runs documentados = reales | Conteo real | Doc |
| --- | --- | --- | --- | --- | --- |
| r229 | Lite | `47988786` | 3 (cumulative, h1d, scientific) | 346 archivos, 2034 passed, 8 xfail, 34 todo | idéntico |
| r229 | Plus | `6edbb54d` | 4 (cumulative, h1d, native, SG28) | 1806 passed, 6 xfailed, 88.08% | idéntico |
| r230 | Lite | `16e5ca75` | 3 | 348 archivos, 2049 passed, 8 xfail, 34 todo | idéntico |
| r230 | Plus | `9a06ae8d` | 2 | 1818 passed, 6 xfailed, 88.06% | idéntico |
| r231 | Lite | `c7875936` | 3 | 349 archivos, 2055 passed, 8 xfail, 34 todo | idéntico |
| r231 | Plus | `870766b9` | 6 (cumulative, h1d, native, SG28 x2, security) | 1824 passed, 6 xfailed, 88.00% | idéntico |
| r232 | Lite | `c4a49a51` | 3 | 349 archivos, 2056 passed, 8 xfail, 34 todo | idéntico |
| r232 | Plus | `89bf0e26` | 2 | 1825 passed, 6 xfailed, 88.04% | idéntico |

No hay gates declarados que no existan, ni runs verdes omitidos, ni fallos
presentados como éxito.

## 4. Commits documentales: "0 corridas"

| Commit | Repo | Runs reales |
| --- | --- | --- |
| `6287463d` | Lite | 0 |
| `b7bd70a3` | Lite | 0 |
| `29d08a47` | Plus | 0 |
| `4ec07aed` | Plus | 0 |
| `8ec414bb` | Lite | 0 |
| `6eab838d` | Plus | 0 |
| `574ca8bf` | Lite | 2 (cumulative + h1d, ambos SUCCESS) |
| `a5009a79` | Plus | 2 (cumulative + h1d, ambos SUCCESS) |

Los dos últimos no fueron un relanzamiento deliberado: el filtro de rutas incluye
`CONTINUITY_NEXT_ACTION.json` (Lite) y re-incluye `EXECUTION_PROTOCOL.md` (Plus).
Quedó documentado en r232.

## 5. Brecha encontrada y corregida: runs sin SHA

12 citas (6 SHA únicos) identificaban el run pero no el commit sobre el que corrió,
lo que impedía reconstruir run→SHA solo con la documentación. Se añadió el SHA en
el punto de cita:

| SHA | Repo | Runs | Dónde se anotó |
| --- | --- | --- | --- |
| `8db3456be0324aecefd5d63ba8b68ab474399e56` | Lite | 39219361555/565/663 | `CONTINUITY.md` (AS-DIV-07) |
| `0fcdc9bb77c2e9dc5e3ae5cb399e10b9ef3d139c` | Plus | 39219370525/577 | `CONTINUITY.md` (AS-DIV-07) |
| `482d81d5f42a249fd0a03af898a231cf012fe45a` | Lite | 39557278838 (fallo de formato, supersedido) | `CURRENT_STATE.md` |
| `0690d47592b063e0542a38b2f80d2ce6b1de0cdc` | Lite | 38207655164/170/199 | `SY_P_23_CONVENTION.md` |
| `19daac09e6f98d4429ceeca904bcfdd5b7efd46b` | Plus | 38207857516/573 | `SY_P_23_CONVENTION.md` |
| `9f17dc516af64cd276154dc11dfb4f66add79241` | Plus | 39274466829 (primer run AS-PAR-09, defecto real) | `GLOBAL_CERTIFICATION_DASHBOARD.md` |

Tras la corrección, las 477 citas resuelven y los 197 SHA documentados tienen run.

## 6. Veredicto

- **No hay runs inventados, ni SHA desplazados, ni éxitos atribuidos a fallos.**
- **No hay gates omitidos en los cierres recientes:** el conjunto de runs por SHA
  coincide exactamente con lo documentado y todos son `SUCCESS` en `attempt=1`.
- **Los conteos declarados coinciden con los logs** en r229, r230, r231 y r232.
- **Las afirmaciones de "0 corridas" son correctas** para los seis commits
  documentales verificados.
- La única brecha era de trazabilidad (12 citas sin SHA), ya corregida.
- El defecto abierto de Plus (`ln(1-1)`/`ln(cos(pi/2))` → `zoo`) **no es una
  discrepancia documental**: está registrado como defecto de producto y
  precondición de EV-T.

## 7. Límites

- La verificación por existencia/SHA/conclusión cubre toda la historia citada; los
  conteos se re-derivaron de logs solo para los cuatro cierres recientes.
- No se comparó automáticamente el nombre del workflow afirmado en cada frase
  histórica (demasiado ruido por líneas con varios runs); sí se verificó el
  conjunto de workflows por SHA en r229–r232.
- Persisten las limitaciones del informe lógico r232: la auditoría no cubre los
  ~600 casos restantes de la matriz.
