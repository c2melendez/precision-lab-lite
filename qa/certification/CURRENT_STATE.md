# r517 — IN-D-04 implementado/publicado; verificación automática en curso

Global **OPEN**. IN-D-03 quedó **PASS_SCOPED bilateral** en r516, con jobs/pasos/logs y huellas revisados; sus gates verdes no se repitieron. Esta revisión inicia IN-D-04 y no lo certifica todavía.

## Contrato y reproducción IN-D-04
Fuente gzip 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb, sección 3.A:
2*sin(x)^2-sin(x)-1<0 en [0,2π) -> [0,π/2) ∪ (π/2,7π/6) ∪ (11π/6,2π).
Cero incluido; π/2,7π/6,11π/6 y el extremo de dominio 2π excluidos.

Test-first real: Lite falló en tres variantes (ASCII, núcleo LaTeX e inversión) por roots no polinómico. Plus falló en servicio y HTTP: devolvía solo Interval.Ropen(0,pi/2), omitiendo dos componentes. No se relajó ningún oráculo.

## Corrección y validación
- Lite: src/engine/inequality.ts reconoce exactamente el polinomio congelado o su comparación invertida. Usa (2*sin(x)+1)*(sin(x)-1)<0, equivalente a -1/2<sin(x)<1. Devuelve las tres componentes por período 2π con k entero; k=0 representa el dominio contractual. Mantiene el punto de igualdad aislado en π/2 fuera de la solución.
- Plus: backend/app/services/phase2_service.py devuelve la unión exacta completa y una advertencia visible de alcance [0,2*pi). La normalización acepta los productos no evaluados que conserva el parser (-1*1), limitada a ≤16 operaciones, la función sin(variable) exacta y potencias cuadráticas; no expande potencias arbitrarias ni otros argumentos.
- Regresiones permanentes: Lite tests/trigonometryInD04.audit.test.ts (6 casos) y Plus backend/tests/test_trigonometry_in_d04.py (5 casos); fila original completa, variantes, signos/factorización, tres componentes, extremos, cambio de variable/HTTP según motor, comparaciones constantes y controles negativos.
- Local Lite: 101 focales/parser/inecuaciones PASS y build/typecheck PASS. Primer acumulativo con un worker: 439 suites PASS, 1 FAIL por timeout 5000ms de AS-B-18 (2529 passed, 1 failed, 8 expected fail, 34 TODO), mientras se compilaba el build. AS-B-18 + IN-D-04 aislados luego 8/8 PASS con timeout original. Se conservó el fallo local y se inició un acumulativo serial sin build concurrente; no se afirma su resultado antes de concluir.
- Local Plus: 34 pruebas IN-D/phase2/SY-Q PASS, una advertencia Starlette; no suite backend completa local.

## Publicación y runs push del SHA exacto
| Motor | SHA técnico | Workflow | Run |
|---|---|---|---|
| Lite | 37a2380dd9072355a630199c3597338ef4741788 | CI | 43622992119 |
| Lite | mismo | Cumulative | 43622992290 |
| Lite | mismo | H1d | 43622992133 |
| Lite | mismo | Scientific UI | 43622992173 |
| Plus | e3197eb3fa258e3ffb6d8643b61f0a261312abeb | CI | 43623011274 |
| Plus | mismo | Cumulative | 43623011267 |
| Plus | mismo | H1d | 43623011311 |
| Plus | mismo | Native Syntax | 43623011280 |
| Plus | mismo | Dependency/security | 43623011306 |

Publicados con expected_sha sobre el cierre documental bilateral 7a82dce5/33bafa3e, tras refrescar HEAD/runs. Corridas observadas IN_PROGRESS; decisión WAIT, sin dispatch manual ni duplicación. Runner 43622992118/43623011294 SUCCESS es resumen y no prueba. El cambio real del backend selecciona una revisión de seguridad nueva; no se acredita score ni PASS de perfiles omitidos.


## Revisión de CI de este corte
Lite CI 43622992119, Cumulative 43622992290 y H1d 43622992133 terminaron SUCCESS. Cumulative/job 132532572503 ejecutó 440 suites, 2530 passed, 8 expected fail y 34 TODO, incluidos los seis casos IN-D-04; H1d/job 132532572607 22/22. Logs revisados con skip=false y sin evidencia reutilizada internamente. Backend-security Plus/job 132532725093 SUCCESS (pip-audit sin vulnerabilidades conocidas, Bandit y 24 regresiones), sin acreditar score de mutación ni perfiles omitidos. La matriz visual Lite y los gates completos Plus seguían en curso al observarlos; IN-D-04 permanece WAIT.

## Alcance, bloqueos y siguiente acción única
Parser/motor Lite y API normalizada Plus; no ingesta literal completa del sufijo de dominio ni E2E dedicado de fila. Lite expresa periodicidad; Plus declara el período contractual. SKIP/XFAIL/TODO no son PASS.
EV-D-01 BLOCKED; S25 requiere revisión del informe existente por perfil y de la campaña nueva sin relanzar inputs idénticos; H2/SG28 OPEN; DIST-01..08 BLOCKED. SG28_EVALUATE_ISOLATION sigue off por defecto. Sin producción/releases.

Revisar las corridas anteriores, todos sus jobs/pasos/logs y huellas. Corregir fallos confirmados, conservar la evidencia ya ejecutada y cerrar IN-D-04 solo cuando sus gates funcionales pertinentes estén acreditados bilateralmente. Mantener seguridad por separado según el protocolo. Tras cierre iniciar IN-D-05.
