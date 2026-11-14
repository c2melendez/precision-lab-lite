# r513 — TRIG-IN-D-02 PASS_SCOPED bilateral; siguiente IN-D-03

Global **OPEN**. Se revisaron los gates existentes, sus jobs, pasos y logs; no se despachó ninguna repetición. El planificador dio CURRENT y REUSE para las huellas funcionales de ambos HEAD documentales frente a los SHA de origen.

## Cierre IN-D-02
Contrato fuente sección 3.A, gzip 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb: cos(x)≤0 en [0,2π) -> [π/2,3π/2], ambos extremos incluidos.
| Motor | SHA técnico | Evidencia revisada |
|---|---|---|
| Lite | 37227c30e638d1f46b24a8f874915ce958aa02cf | CI 43549505429; Cumulative 43549505495/job 132308439401: 438 suites, 2518 passed, 8 expected fail, 34 TODO; focal 5/5 |
| Lite | mismo | H1d 43549505444/job 132308439436: 22/22; Scientific UI 43549505417/job 132308439502: 456/456 |
| Plus | 0575e1dce1af03ac5e46348ad5c47ac36a266ab7 | CI 43549522361; Cumulative 43549522414/backend 132308495997: 3014 passed, 1 skipped, 11 xfailed, cobertura 88.05%, focal 3/3 PASSED explícitos |
| Plus | mismo | Cumulative frontend 132308495722: 1055 passed, 28 TODO; H1d 43549522371/job 132308495620: 38/38 |

Todos esos workflows y jobs terminaron SUCCESS, con pasos realmente ejecutados y guards skip=false/evidence_run_id vacío. Runner 43549505418/43549522350 solo produjo resumen; sus pasos omitidos no son evidencia adicional. TODO/XFAIL/SKIP quedan fuera del PASS. Las huellas comparadas se registran en continuity.json.

Alcance: parser/motor Lite (ASCII y núcleo LaTeX) con solución periódica explícita; k=0 representa la fila. Plus servicio/HTTP normalizado en el período contractual; no se afirma una solución periódica global ni ingesta literal del sufijo completo de dominio ni UI dedicada de fila.

## Siguiente acción única
TRIG-IN-D-03, fuente: tan(x)<1 con x∈(-π/2,π/2), resultado (-π/2,π/4). Congelar las tres celdas, probar servicio/parser/HTTP, extremos abiertos y exclusión de asíntotas. Corregir solo brechas reproducidas; conservar el alcance de rama/período explícito. Ejecutar gates automáticos pertinentes tras el cambio técnico. No saltar a IN-D-04.

## Bloqueos conservados
EV-D-01 BLOCKED; S25/mutación independiente sin score aceptado por shutdown del runner 43538686314/job 132273991849, sin retry idéntico; H2/SG28 OPEN; DIST-01..08 BLOCKED. Seguridad requiere revisión dinámica por perfil, no se lanza una campaña desde una ventana reciente incompleta. SG28_EVALUATE_ISOLATION sigue off por defecto. Sin despliegue ni release.
