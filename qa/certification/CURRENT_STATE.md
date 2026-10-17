# Estado vigente de certificación — Precision Lab Lite / Plus

Corte:2026-10-17 UTC/Honduras. Certificación global **OPEN**; porcentaje reconciliado **ND**.

**Siguiente tarea única: SY-X-16-BILATERAL — READY.** X15 PASS acotado: fixture script inerte/error, sin inserción ni ejecución del payload. Leer índice y contratos; verificar HEAD/Actions antes de actuar. X04Plus/X14Plus siguen bloqueados.

## 2026-10-17 UTC — SY-X-15 bilateral verificado
Fixture original `\text{<script>alert(1)</script>}` y oráculo intactos: texto inerte o error claro; nunca ejecución ni inserción del payload como HTML.
En los tres perfiles Chromium se ingiere la fuente original en MathLive y se exige texto completo inerte o aviso claro, sin resultado matemático falso. Se observa el documento y los ShadowRoot creados por MathLive, incluidos los cerrados; se verifica ausencia de nodos script del payload, diálogos y pageerrors antes de calcular, tras el resultado/error y después de recuperar. La sonda no sustituye alert ni bloquea inserción/ejecución: registra los diálogos y el test falla si aparecen, aunque los cierre para evitar un bloqueo del runner.
Un test separado comprueba el detector: inserta deliberadamente un script application/json inerte con el texto alert(1) en un ShadowRoot cerrado y exige una detección y cero diálogos. Es control del harness, no ejecución del payload de producto. Los contextos están aislados. Las dos copias del helper son idénticas y sus rutas están incluidas en los filtros nativos.
Recuperación real Worker Lite/HTTP Plus:2+3=5 y reentrada del5 con dos IDs exitosos distintos. Local, Lite parser y handler Worker real con transporte simulado rechazan el original; Plus HTTP real responde application/json con PARSE_ERROR/VALIDATION_ERROR, resultados nulos y recuperación/reentrada con tresIDsdistintos. No se acredita una llamada HTTP/Worker inválida desde UI cuando el rechazo pueda ser local.
Inspección de render: errores como texto React; Lite matemática mediante MathLive readonly; Plus MathRenderer usa salida KaTeX o texto React de fallback. Este lote no cambia motor, renderizadores, dependencias ni límites.
- Lite SHA `102bc45292f449854dc30bbdedaaac88d1cb64cc`: [acumulativo39015627360](https://github.com/c2melendez/precision-lab-lite/actions/runs/39015627360)1614PASS/30TODO,190archivos,typecheck/build y34pruebas del mecanismo; [nativo39015627406](https://github.com/c2melendez/precision-lab-lite/actions/runs/39015627406)432/432PASS,incluidos fixture y control de sonda en3perfiles,sin reintentos observados; [H1d39015627425](https://github.com/c2melendez/precision-lab-lite/actions/runs/39015627425)21PASS.
- Plus SHA `298a3c48a9cc140142852242aa88a481d4dcc311`: [acumulativo39015624925](https://github.com/c2melendez/precision-lab-plus/actions/runs/39015624925)frontend1005PASS/28TODO,146archivos,typecheck/build;backend1480PASS/3XFAIL,cobertura88.11%,56pruebas del mecanismo. [Nativo39015624985](https://github.com/c2melendez/precision-lab-plus/actions/runs/39015624985)54/54PASS (18desktop+36tablet/mobile),sin reintentos. [H1d39015624876](https://github.com/c2melendez/precision-lab-plus/actions/runs/39015624876)38PASS.
Las pruebas nuevas añaden3ejecuciones del fixture y3del control del detector por producto; los totales son tests, no requisitos independientes ni porcentaje de certificación. Logs y pasos revisados por SHA. Sin nueva campaña de mutación/dependencias ni dispatch manual duplicado. Las regresiones de los bloqueos previos permanecen en el acumulativo; no se abrió una campaña dirigida a repetir X14 sin cambiar sus precondiciones.
Alcance: este fixture y rutas instrumentadas en desktop/tablet/mobile Chromium; no auditoría universal de XSS, otros payloads, teclas/SO/motores o botónReusar. S25 yS19 integrales siguen abiertos; TODO/XFAIL/SKIP no son PASS. X04Plus y X14Plus continúan BLOCKED, SY-P23 y H2/SG28/DIST abiertos. El puntero ausente en README de main mantiene su guía alternativa, sin mover default_branch. Global OPEN, porcentaje ND.
**Siguiente único: SY-X-16-BILATERAL**, fuente original input de /etc/passwd: rechazada/ignorada sin lectura de archivos. Inspeccionar el contrato y usar instrumentación que detecte intentos sin leer el archivo real del host, con recuperación y evidencia por SHA; no repetir campañas equivalentes.

## Bloqueos conservados

| Bloque | Estado y condición de salida |
|---|---|
| S25 dependencias | BLOCKED: últimas revisiones registraron 5 high en cada producto. [Remediación](SECURITY_REMEDIATION.md): parche compatible de braces o migración Tailwind validada; no repetir sin cambio de precondición. |
| S19 integral | OPEN: el initial run no mide mutaciones. La campaña histórica Lite sobre 6cbec764 obtuvo 10,32 %, sin acreditar HEAD actual; conservar sus resultados, no duplicarla. |
| SY-X-04 Plus | BLOCKED: fuente de 999 caracteres frente a máximo 500 en HTTP/parser y presupuesto AST 200. [Contrato](SY_X_04_LENGTH_CONTRACT.md), [propuesta](SY_X_04_LENGTH_DECISION.md). Oráculo 500x preservado en XFAIL estricto. |
| SY-P-23 | OPEN: convención a/bc pendiente, XFAIL estricto. |
| H2/SG28/DIST | OPEN/BLOCKED: contrato de vigencia/fencing, integración HTTP y luego topología autorizada. [Criterios](SG28_INTEGRATION_EXIT_CRITERIA.md). No repetir preflights equivalentes. |
| Otros canales/módulos | PARCIAL/ND: R12–14 y X01–03 nativos Plus ya acreditados; otros casos conservan sus gaps. |
| SY-X-14 Plus | BLOCKED: AST201nodos/profundidad101 frente a200/30. Rechazo y recuperación PASS; matemática no acreditada. [Contrato](SY_X_14_DEPTH_CONTRACT.md). No repetir sin cambiar precondición. |
| Puntero en main | OPEN con guía alternativa: resolver rama mediante Actions e índices bilaterales. El README raíz aún no tiene puntero. |

El log conserva la historia. El índice es autoridad del siguiente paso. Sin producción,deploy,merge,release ni flags remotos.
