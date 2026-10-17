# Estado vigente de certificación — Precision Lab Lite / Plus

Corte: 2026-10-17 UTC (2026-10-16 Honduras). Certificación global **OPEN**; porcentaje reconciliado **ND**.

## Reanudación única

**Siguiente tarea: CI-SPLIT-SECURITY-MUTATION-SCOPE — WAIT_CI.** Selector porjob publicado enPlus SHA `ff647a581a4a6d9b5423231ded44c3bc5fbb3088`;inspeccionar runs existentes del ledger,no despachar mutaciones. Confirmar plan sincampañas para este cambio deorquestación yregresiones pertinentes antes de cerrar.

Leer [continuity.json](continuity.json), [CONTINUITY.md](CONTINUITY.md) y el protocolo. Verificar HEAD y Actions; reconciliar cambios técnicos no registrados. El prompt externo es solo bootstrap.

## Evidencia vigente

| Producto/canal | SHA técnico de origen | Evidencia revisada |
|---|---|---|
| Lite acumulativo | 227ad7513a199dee984b0b1e48fb7550b98d5c8d | [38990826368](https://github.com/c2melendez/precision-lab-lite/actions/runs/38990826368):1592 PASS /30 TODO;181archivos;typecheck/build PASS |
| Lite nativo | mismo SHA Lite | [38990826311](https://github.com/c2melendez/precision-lab-lite/actions/runs/38990826311):402/402;X06 completo yregresiones,tres perfiles Chromium |
| Lite H1d | mismo SHA Lite | [38990826322](https://github.com/c2melendez/precision-lab-lite/actions/runs/38990826322):21PASS |
| Plus acumulativo | 2d6434b7b7216efa6aaf2ca30d1a277960398c2e | [38991052743](https://github.com/c2melendez/precision-lab-plus/actions/runs/38991052743):frontend997 PASS/28 TODO;backend1460 PASS/2 XFAIL;cobertura88,02%;typecheck/build PASS |
| Plus nativo X01–03/R12–14/X05–06 | mismo SHA Plus | [38991052824](https://github.com/c2melendez/precision-lab-plus/actions/runs/38991052824):24/24,tres perfiles yHTTP real |
| Plus H1d | mismo SHA Plus | [38991052808](https://github.com/c2melendez/precision-lab-plus/actions/runs/38991052808):38PASS |
| S25 actual | db29648ac2ab2607021a32089c5555d3cbb9b2b0 | [38990822464](https://github.com/c2melendez/precision-lab-plus/actions/runs/38990822464):backendsecurityPASS24tests,pip-audit/Bandit;frontendFAIL5high/2moderate;mutaciones aún en curso |
| S19 initial run anterior | b90f15e11d6b48a953aa37319afda711dcf58e2e | [38986979633](https://github.com/c2melendez/precision-lab-plus/actions/runs/38986979633):759tests,sin mutaciones ni score;histórico |

TODO/XFAIL/SKIP no son PASS. Los commits documentales conservan SHA de evidencia de origen. Tres perfiles Chromium no acreditan cada tecla/SO/otro motor/botón Reusar.

## Último cierre

SY-X-06 PASS acotado bilateral, con las dos alternativas permitidas por el oráculo. Fuente común de exactamente10000caracteres: '1+' repetido4999veces y '11' al final. Lite procesa5010 y reingresa5010;Plus recibe la fuente íntegra y responde422 con aviso claro de máximo500caracteres. Ambos recuperan5 yreingresan la salida mediante su ruta real. No se aumentaron límites ni se acortó la fuente.

Se corrigió el mensaje genérico de validación backend Plus y el volcado de input en sus logs. La primera prueba nativa falló por selector ambiguo entre aviso global y resultado;el selector corregido verifica el resultado local y conserva el criterio. No hay PASS atribuido al run fallido. Los tiempos6,7–10,4s corresponden al test Lite completo, no a latencia aislada de cálculo ni a unSLA.

## Continuidad y no repetición

El ledger guarda alcance, evidencia, bloqueos y una tarea. El guard compara mismo checkout/workflow;el planificador compara huellas y observaciones frescas. Un REUSE enlaza al origen, nunca es ejecución nueva. 34 pruebas del mecanismo aprobadas. Las actualizaciones documentales no disparan CI.

La selección conservadora actual aún activa campañas ajenas por cambios de backendcore. La campaña38990822464 ya existe:conservar IDs y esperar/revisar sus jobs, sin duplicarla. Resolver su alcance es el objetivo siguiente;no se ha declarado resuelto este punto.

## Bloqueos conservados

| Bloque | Estado y condición de salida |
|---|---|
| S25 dependencias | BLOCKED: últimas revisiones registraron 5 high en cada producto. [Remediación](SECURITY_REMEDIATION.md): parche compatible de braces o migración Tailwind validada; no repetir sin cambio de precondición. |
| S19 integral | OPEN: el initial run no mide mutaciones. La campaña histórica Lite sobre 6cbec764 obtuvo 10,32 %, sin acreditar HEAD actual; conservar sus resultados, no duplicarla. |
| SY-X-04 Plus | BLOCKED: fuente de 999 caracteres frente a máximo 500 en HTTP/parser y presupuesto AST 200. [Contrato](SY_X_04_LENGTH_CONTRACT.md), [propuesta](SY_X_04_LENGTH_DECISION.md). Oráculo 500x preservado en XFAIL estricto. |
| SY-P-23 | OPEN: convención a/bc pendiente, XFAIL estricto. |
| H2/SG28/DIST | OPEN/BLOCKED: contrato de vigencia/fencing, integración HTTP y luego topología autorizada. [Criterios](SG28_INTEGRATION_EXIT_CRITERIA.md). No repetir preflights equivalentes. |
| Otros canales/módulos | PARCIAL/ND: R12–14 y X01–03 nativos Plus ya acreditados; otros casos conservan sus gaps. |

El [log](EXECUTION_LOG.md) y sus archivos preservan la historia; las fotografías anteriores no dictan el siguiente paso. Sin producción, deploy, merge, release ni activación remota de flags.

CI-CAMPAIGN-OVERSCOPE OPEN:corregir selecciónporjob,siguiente objetivo indicadoarriba.
