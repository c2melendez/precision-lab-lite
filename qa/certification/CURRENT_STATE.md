# r516 — IN-D-03 PASS_SCOPED bilateral; siguiente IN-D-04

Global **OPEN**. Se revisó el contrato, las pruebas, los jobs/pasos/logs y las huellas del HEAD actual. El planificador confirmó CURRENT y REUSE para los gates funcionales. No se despachó ni repitió ninguna corrida.

## Cierre IN-D-03
Fuente gzip 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb, sección 3.A: tan(x)<1 en (-π/2,π/2) -> (-π/2,π/4). Polo y punto de igualdad excluidos.
| Motor | SHA de evidencia | Gates ejecutados y revisados |
|---|---|---|
| Lite | 435454fdd4f4095aa6acfb05c54660fa001c532b | CI 43559483166; Cumulative 43559483200/job 132339725187: 439 suites, 2524 passed, 8 expected fail, 34 TODO, focal 6/6 |
| Lite | mismo | H1d 43559483135/job 132339725464: 22/22; Scientific UI 43559483128/job 132339725404: 456/456 |
| Plus | c0605101d99a1bc4d8203cb544ac0a1c5641238c | CI 43559502111/job backend 132339787358: 3020 passed, 88.04%; Cumulative 43559502095/jobs 132339787080 y 132339787382: backend 3020 passed, 1 skipped, 11 xfailed, 88.04%, focal 6/6; frontend 1055 passed, 28 TODO |
| Plus | mismo | H1d 43559502126/job 132339786977: 38/38; Native 43559502118/job 132339787175: desktop 26 y tablet/móvil 52 |

Todos los gates y jobs funcionales requeridos terminaron SUCCESS, sin pasos de prueba omitidos. Guards skip=false y evidence_run_id vacío: ejecución real de origen. Runner SUCCESS solo produjo resumen y no cuenta como prueba. SKIP/XFAIL/TODO no son PASS. Las revisiones documentales posteriores conservaron las mismas huellas técnicas; no requerían CI nueva.

Alcance certificado: parser/motor Lite con períodos explícitos (k=0 representa la fila), servicio/HTTP normalizado Plus con advertencia de rama principal. No solución periódica global de Plus, ingesta literal del sufijo completo de dominio ni E2E dedicado de fila. Las suites E2E anteriores acreditan regresión general.

## Siguiente acción única
**TRIG-IN-D-04**: 2*sin(x)^2-sin(x)-1<0 en [0,2π) -> [0,π/2) ∪ (π/2,7π/6) ∪ (11π/6,2π).
Congelar las tres celdas originales; test-first bilateral sobre parser/solver y servicio/HTTP. Verificar cero incluido, exclusión de π/2,7π/6,11π/6 y 2π en el período contractual, signos en cada componente y canales. Corregir solo brechas demostradas y publicar un cambio técnico consolidado; verificar gates automáticos por SHA. No saltar a IN-D-05.

## Bloqueos separados
EV-D-01 BLOCKED; H2/SG28 OPEN y DIST-01..08 BLOCKED. SG28_EVALUATE_ISOLATION sigue off por defecto, sin producción/releases.
S25 sigue BLOCKED por revisión de aceptación por perfil: la campaña 43559502112/job 132339909267 ya terminó SUCCESS pero el informe contiene supervivientes/timeouts; el color verde no cierra S25 y los jobs frontend omitidos no son PASS. El shutdown histórico 43538686314 se conserva como antecedente, no como estado de una corrida aún activa. Revisar el informe existente y sus criterios, sin rerun idéntico.
