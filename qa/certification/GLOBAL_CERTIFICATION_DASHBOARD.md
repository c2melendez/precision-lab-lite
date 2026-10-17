# Tablero vigente de certificación — Precision Lab Lite y Plus

Fecha: 2026-10-17 UTC. Certificación global **OPEN**; porcentaje reconciliado **ND**. Índice operativo: [continuity.json](continuity.json). Próximo paso único: consultar `next_action` tras validar el estado con HEAD/Actions.

## Recorrido documentado de Syntax309

| Sección | Casos oficiales | Recorrido registrado, no porcentaje certificado |
|---|---:|---|
| SY-P | 33 | Abordada; SY-P-23 contractual abierto. |
| SY-F | 48 | Abordada; persisten límites de canal/oráculo documentados. |
| SY-E | 31 | Abordada; conservar gaps MathLive y ramas complejas. |
| SY-N | 31 | Abordada; conservar convenciones y límites por canal. |
| SY-D | 14 | Recorrido hasta D-14; no cierre UI universal. |
| SY-U | 25 | Recorrido hasta U-25; cobertura por caso. |
| SY-V | 28 | Recorrido hasta V-28; no inferir cobertura nativa Plus. |
| SY-Q | 23 | Recorrido hasta Q-23 con alcances diferenciados. |
| SY-M | 20 | Recorrido hasta M-20; no certifica todo el módulo Matrices. |
| SY-S | 20 | Recorrido hasta S-20 registrado. |
| SY-R | 14 | Recorrido hasta R-14; R12–14 nativo Plus PASS acotado; otros canales pendientes. |
| SY-X |22|X01–03,X05–13 PASS acotado bilateral;X04Plus BLOCKED;X14 Lite PASS/Plus BLOCKED AST;X15–22 pendientes.|
| Total | 309 | Fixture común intacto; certificación integral OPEN. |

Las cifras son filas de la matriz, no totales de PASS. Consultar evidencia vigente de cada canal en el índice y el log. TODO/XFAIL/SKIP y pruebas manuales no se suman a PASS. IN625, Syntax309 y campañas anteriores no son denominadores sumables sin deduplicar requisitos.

## Áreas de cierre

| Área | Estado | Acción |
|---|---|---|
| Científica y matrices matemáticas | PARCIAL | Continuidad del caso vigente y reconciliación de canales. |
| H2/SG28/DIST | OPEN/BLOCKED | Contrato de vigencia/fencing, integración HTTP y luego aceptación multihost. |
| Seguridad npm/S25 | BLOCKED | Parche compatible o migración validada; mantener gate estricto. |
| Mutación S19 | PENDIENTE de evidencia actual | Gate focalizado del lote técnico, no reejecuciones sin diagnóstico. |
| UI Plus | PARCIAL | 48/48 nativos: X14 acredita rechazo/recuperación, no resolución matemática. Otros canales conservan gaps. |
| Gráficas/Matrices/Estadística/Unidades | PARCIAL; requisitos ND | Vincular operaciones y flujos a requisitos únicos. |
| Geometría | PENDIENTE de inventario reconciliado | Localizar contrato, implementación y pruebas. |
| Visual/responsive/accesibilidad | PARCIAL | Reconciliar matriz S26 y capturas/SHA; perfiles Chromium no prueban todos los motores/SO. |
| Teclado/historial/reusar/compartir/persistencia | PARCIAL/MANUAL | Revisar gaps vigentes por canal, sin extrapolar desde reentrada programática. |
| Paridad final | OPEN | Mismo requisito y canal, no simple comparación de cantidad de tests. |

[Tablero anterior archivado](history/2026-10-16_pre_continuity_GLOBAL_CERTIFICATION_DASHBOARD.md), [estado](CURRENT_STATE.md), [protocolo](EXECUTION_PROTOCOL.md), [historial](EXECUTION_LOG.md), [gaps](MANUAL_CAPABILITY_GAPS.md).




## Último corte verificado

## 2026-10-17 UTC — SY-X-14: Lite validado, matemática Plus bloqueada
El fixture descriptivo se conserva intacto. Su expansión operativa usa 50 fracciones recíprocas reales: 501 caracteres LaTeX. El testigo HTTP de 50 divisiones mide 201 caracteres; el árbol SymPy sin evaluar tiene 201 nodos y profundidad 101. No se sustituyó la fuente por x antes de validar.
**Lite:** paridad 49/50/51 comprobada con Algebrite y el handler Worker real; 50 devuelve x y los vecinos impares1/x. La restricción original x≠0 se verifica en los metadatos. El navegador prueba MathLive con 50 niveles y control49, salida exacta visible, restricción x≠0 visible, rechazo de cero anidado, recuperación5 y reentrada; cinco IDs exitosos distintos y cero pageerrors. Pegar solo el LaTeX x inicia una expresión nueva: no se acredita persistencia automática de restricciones sin sus metadatos ni el botónReusar.
**Plus:** el original traducido conserva las50divisiones y cabe en la longitud HTTP500. El AST excede profundidad30 y también nodos200. HTTP y MathLive muestran COMPLEXITY_LIMIT por profundidad, sin resultado ficticio, y se recuperan con5 y reentrada en tres perfiles. **Esto no resuelve el caso matemático:** el oráculo x con x≠0 queda BLOCKED y XFAIL estricto. Elevar solo profundidad tampoco solventaría nodos. [Contrato](SY_X_14_DEPTH_CONTRACT.md). No se cambian motor ni límites.
- Lite SHA `7decaedce18874cb8d81c7137761f69b860cca22`: [acumulativo39014331621](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331621)1612PASS/30TODO,189archivos,typecheck/build,34pruebas del mecanismo; [nativo39014331682](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331682)426/426PASS,incluidos X14 y49niveles en3perfiles,sin reintentos observados; [H1d39014331642](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331642)21PASS.
- Plus SHA `a66dac769c3212cb8e3dfe9951030eec0bd4711d`: [acumulativo39014327670](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327670)frontend1005PASS/28TODO,146archivos,typecheck/build; backend1479PASS/3XFAIL,cobertura88.07%;56pruebas del mecanismo. [Nativo39014327763](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327763)48/48PASS (16desktop+32tablet/mobile),incluye rechazo/recuperación deX14,no resolución. [H1d39014327685](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327685)38PASS.
Pruebas locales nuevas: Lite5PASS; Plus HTTP1PASS+1XFAILestricto. No campañas nuevas de mutación/dependencias, no dispatch manual ni repetición de gates equivalentes. Los commits documentales no acreditan nueva ejecución.
Continuidad: default_branch=main en ambos; sus README no contienen el puntero canónico. La rama qa/syntax-audit-in625-a1 se verificó mediante head_branch de las corridas reales y canonical_branch de los índices bilaterales. Se documenta recuperación genérica por esos metadatos y, si hace falta, búsqueda de ramas con índice, sin regresar al S26 histórico ni cambiar default_branch. El puntero raíz sigue ausente; la guía alternativa no lo convierte en existente.
Chromium desktop/tablet/mobile y asignación/input MathLive no certifican todas las teclas/SO/motores ni persistencia universal del dominio. TODO/XFAIL/SKIP no son PASS. Global OPEN, porcentaje ND. S25,S19,SY-P23,SY-X04Plus y H2/SG28/DIST permanecen abiertos. X14Plus es un bloqueo adicional explícito; no volver a ejecutar el mismo rechazo hasta cambiar la precondición contractual. **Siguiente único: SY-X-15-BILATERAL**, texto con script tratado como texto o error, nunca HTML ejecutable, con recuperación y evidencia por canal.
