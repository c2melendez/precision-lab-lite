# SY-F — Reconciliación de cobertura y evidencias (48 registros)

Fecha: 2026-10-13. Rama: `qa/syntax-audit-in625-a1`. Alcance: Lite y Plus, sección F de Syntax 309.

## Evidencia confirmada
- Ambos `qa/certification/syntax309_cases.jsonl` contienen 48 IDs distintos consecutivos `SY-F-01..SY-F-48`, sin huecos en esa sección.
- La búsqueda estática de referencias a esos IDs en `tests/syntax309SyFNumeric.audit.test.ts` (Lite) y `backend/tests/test_syntax309_syf_numeric.py` (Plus) encuentra los 48 IDs en cada archivo. **Esto es presencia de referencias, no prueba de que cada caso tenga equivalencia matemática y cobertura de canales contractuales suficiente.** Hay tests parametrizados, testigos numéricos concretos y distintas condiciones de aceptación.
- Lite: último gate acumulativo para SY-F-48 `38509326801`, commit técnico `53bd4267d6b30d4fbc3033163318bc668be72937`, SUCCESS.
- Plus: último gate acumulativo para SY-F-48 `38509334308`, commit técnico `2d97d46e50f152fc0223c404f55b15c49713822a`, SUCCESS (jobs backend y frontend). Los commits documentales posteriores no invalidan evidencia del último cambio técnico.

## Alcance acreditado y límites
| Capa | Lite | Plus |
|---|---|---|
| Fixture SY-F con 48 IDs | Verificado | Verificado |
| Referencias de los 48 IDs en test de sección | Verificado estáticamente | Verificado estáticamente |
| Gate acumulativo del último cambio técnico | SUCCESS | SUCCESS |
| Interpretación de LaTeX de fixture en suite | Tests usan parser original de Lite | La mayoría de tests usa notación backend traducida: **sin equivalencia de canal fuente demostrada** |
| E2E de MathLive/teclado para 48 casos | NO ACREDITADO en esta reconciliación | NO ACREDITADO en esta reconciliación |
| Oráculo simbólico general para identidades, parámetros y convenciones | PARCIAL: testigos y muestreos, no certificación universal | PARCIAL: testigos y muestreos, no certificación universal |
| Semántica original con barras anidadas, raíces de índice y ambigüedad por canal | Requiere auditoría específica adicional | Requiere auditoría específica adicional |

## Dictamen
**SY-F-01..48: preparación y regresiones unitarias/backend extendidas, gates acumulativos verdes. NO CERTIFICAR la sección F integralmente a nivel UI/MathLive y equivalencia entre motores.** No contar la mera presencia de IDs como 48 PASS contractuales. La matriz global Syntax309 continúa OPEN.

## Próximo objetivo exacto
1. Mantener fixture original inmutable y fortalecer reporte caso × canal × oráculo, documentando PASS/PARTIAL/BLOCKED/MANUAL por ID con enlaces a test/job.
2. Iniciar sección siguiente **SY-E (31 casos)** conforme al inventario `SYNTAX309_EXECUTION_MATRIX.md`; comprobar primero `SY-E-01` y sus criterios antes de introducir regresiones.
3. Continuar auditoría E2E de la sección F en trabajo paralelo independiente, sin asumir que un test backend traducido prueba entrada MathLive.
4. H2/SG28 y DIST multinodo permanecen OPEN/BLOCKED hasta contar con evidencia real de nodos independientes; no mezclarlos con PASS matemáticos.
