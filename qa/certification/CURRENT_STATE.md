# Estado vigente de certificación

Corte: 2026-10-16. Rama canónica: `qa/syntax-audit-in625-a1` en Lite y Plus. Certificación integral: **OPEN**.

## Autoridad y punto de reanudación

Leer [continuity.json](continuity.json) y [CONTINUITY.md](CONTINUITY.md). El índice contiene el SHA técnico de referencia, evidencia por canal, trabajo en curso, bloqueos y **una sola siguiente acción**. Verificar HEAD y Actions reales antes de decidir. Si la huella técnica cambió sin reconciliar el índice, el planificador devuelve RECONCILE y suprime la tarea obsoleta.

No interpretar el historial como instrucciones vigentes. Las fotografías anteriores se conservan en [archivo histórico de estado](history/2026-10-16_pre_continuity_CURRENT_STATE.md); los runs allí citados no se reejecutan por cambiar de LLM.

## Lote actual — verificación pendiente

- Continuidad estructurada, huellas conservadoras y protección contra snapshots obsoletos; 34 pruebas locales del planificador/guard aprobadas.
- Guard de Actions: solo reutiliza mismo checkout SHA/workflow con jobs y pasos reales aprobados; un fallo posterior invalida un verde antiguo. No acepta un run que solo omitió pruebas. Fallo de consulta ejecuta el gate. Revalidación manual exige motivo.
- Build independiente Lite pasa a diagnóstico manual porque el acumulativo ya construye. Se preservan gates requeridos y se recupera ejecución focalizada S25/S19 para dependencias/harness.
- Ambos locks actualizan exclusivamente source-map-js 1.2.1 a 1.2.2. Auditoría local queda en Lite 5 high/2 moderate/1 low, Plus 5 high/2 moderate; S25 sigue abierto.
- Plus contiene errores de conversión dentro del handler UI: la regresión previa reproducía un rechazo no controlado; corrección con 32 pruebas focalizadas aprobadas. Nuevo E2E nativo X01–03, API real y reentrada; navegador local no disponible por descarga truncada, pendiente CI real.
- SY-X-04: Lite prueba la suma original expandida de 500 términos y reentrada exacta; 3 tests focalizados aprobados. Plus prueba rechazo/recuperación y fronteras de longitud/AST; 5 tests focalizados aprobados. Esto no certifica el resultado 500x de Plus.

Estas son validaciones locales del lote preparado; las conclusiones CI y SHA de origen se reconcilian después del push, sin atribuirles PASS anticipado.

## Bloqueos vigentes y ruta

| Bloque | Estado | Referencia/condición de salida |
|---|---|---|
| H2/SG28 y DIST-01..08 | OPEN/BLOCKED | [Vigencia/fencing e integración](SG28_INTEGRATION_EXIT_CRITERIA.md); después topología multinodo autorizada. No repetir preflights equivalentes. |
| S25 npm | BLOCKED | [Remediación](SECURITY_REMEDIATION.md): falta parche compatible de braces o migración Tailwind probada; sin supresiones. |
| S19 Plus | PENDIENTE de gate actual | Inspeccionar workflow de dependencias del lote; no inferir mutación desde acumulativo. |
| SY-P-23 | OPEN | Convención a/bc y XFAIL estricto conservados. |
| SY-X-04 Plus | BLOCKED contractual | 999 caracteres frente a max_length=500; también límite AST200. [Análisis](SY_X_04_LENGTH_CONTRACT.md). No sustituir por 500*x. |
| Cobertura nativa Plus anterior | PARCIAL | X01–03 en verificación; no cerrar por ello todos los casos R/X previos. |
| Manuales/visual/historial y cobertura global | PARCIAL/ND | [Gaps](MANUAL_CAPABILITY_GAPS.md) y tablero; reconciliar requisito/canal antes de calcular porcentajes. |

Política de dos frentes vigente: los bloqueos anteriores no detienen trabajo matemático independiente, pero impiden el cierre global correspondiente. No producción, deploy, merge, release ni activación remota de flags.
