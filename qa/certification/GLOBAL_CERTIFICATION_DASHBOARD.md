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
| SY-X |22|X01–03,X05–13,X15–17 PASS acotado bilateral;X04Plus BLOCKED;X14 Lite PASS/Plus BLOCKED AST;X18–22 pendientes.|
| Total | 309 | Fixture común intacto; certificación integral OPEN. |

Las cifras son filas de la matriz, no totales de PASS. Consultar evidencia vigente de cada canal en el índice y el log. TODO/XFAIL/SKIP y pruebas manuales no se suman a PASS. IN625, Syntax309 y campañas anteriores no son denominadores sumables sin deduplicar requisitos.

## Áreas de cierre

| Área | Estado | Acción |
|---|---|---|
| Científica y matrices matemáticas | PARCIAL | Continuidad del caso vigente y reconciliación de canales. |
| H2/SG28/DIST | OPEN/BLOCKED | Contrato de vigencia/fencing, integración HTTP y luego aceptación multihost. |
| Seguridad npm/S25 | BLOCKED | Parche compatible o migración validada; mantener gate estricto. |
| Mutación S19 | PENDIENTE de evidencia actual | Gate focalizado del lote técnico, no reejecuciones sin diagnóstico. |
| UI Plus | PARCIAL | 63/63 nativos, incluidos controles sintéticos; X14 solo rechazo/recuperación. Otros canales conservan gaps. |
| Gráficas/Matrices/Estadística/Unidades | PARCIAL; requisitos ND | Vincular operaciones y flujos a requisitos únicos. |
| Geometría | PENDIENTE de inventario reconciliado | Localizar contrato, implementación y pruebas. |
| Visual/responsive/accesibilidad | PARCIAL | Reconciliar matriz S26 y capturas/SHA; perfiles Chromium no prueban todos los motores/SO. |
| Teclado/historial/reusar/compartir/persistencia | PARCIAL/MANUAL | Revisar gaps vigentes por canal, sin extrapolar desde reentrada programática. |
| Paridad final | OPEN | Mismo requisito y canal, no simple comparación de cantidad de tests. |

[Tablero anterior archivado](history/2026-10-16_pre_continuity_GLOBAL_CERTIFICATION_DASHBOARD.md), [estado](CURRENT_STATE.md), [protocolo](EXECUTION_PROTOCOL.md), [historial](EXECUTION_LOG.md), [gaps](MANUAL_CAPABILITY_GAPS.md).








## Último corte verificado


## 2026-10-17 UTC — SY-X-17 bilateral verificado con alcance acotado
Fixture original `\write18{ls}` y oráculo intactos: ignorado o rechazado; sin ejecución. El test nunca invoca ls, shell, subprocess, exec, spawn o fork como control positivo.
**Defecto encontrado y corregido en Plus:** nativo39017066935/job117351282488 sobre67b9ca8eb32edf282608e73fcf225ebdd06fda4b:20PASS/1FAILdesktop, perfiles posteriores no ejecutados. Artefacto12094727679 y reproducción directa confirman que MathLive convertía el comando en18l s y Plus mostraba un producto algebraico. No es prueba de ejecución de shell. Se clasifica PRODUCT_CONVERSION: el conversor rechaza ahora el comando TeX write antes de convertir a ASCII. Regresión frontend reproducida roja antes de corregir y aprobada después;10pruebas locales pertinentes ytypecheckPASS. No se relajó el oráculo ni se repitieron inputs idénticos: la nueva validación corresponde al código corregido.
Lite parser rechaza el original como carácter no reconocido; el handler Worker real con transporte simulado lo rechaza y recupera5/reentrada5 conIDs nuevos. Plus endpoint real vía TestClient rechaza el original bajo guarda de eventos Python de lanzamiento: subprocess.Popen,os.system,os.posix_spawn,os.exec,os.spawn,os.fork,pty.spawn. Cada evento tiene control positivo independiente que solo emite sys.audit con argumento sintético inexistente, sin llamar a las APIs de ejecución. La guarda registra y bloquea el intento antes de ejecutarlo; el caso exige cero intentos, aunque fueran capturados. Hooks inactivos al salir del contexto. HTTP recupera2+3=5 y reentrada5 con3IDs distintos.
MathLive ingiere el fixture original. Lite muestra rechazo claro sin resultado; Plus conserva write,18,ls en serialización y muestra Comando TeX no permitido sin POST inválido. UI recupera mediante Worker Lite/HTTP Plus reales y reintroduce5 con2IDs exitosos distintos. Cero diálogos,descargas,filechooser,pageerrors y accesos al objetivo de la sonda anterior; esa sonda de navegador no mide procesos del servidor. La ausencia de lanzamientos se acredita por la guarda HTTP separada y el alcance de las rutas examinadas, no por inferencia desde una UI local.
- Lite SHA `82a83c430a779eaa344be5be7644c9a38bfedc26`: [acumulativo39017068699](https://github.com/c2melendez/precision-lab-lite/actions/runs/39017068699)1618PASS/30TODO,192archivos,typecheck/build,34pruebas del mecanismo; [nativo39017068701](https://github.com/c2melendez/precision-lab-lite/actions/runs/39017068701)441/441PASS,147porperfil,5.8min,sin reintentos observados; [H1d39017068708](https://github.com/c2melendez/precision-lab-lite/actions/runs/39017068708)21PASS.
- Plus SHA `02a8f689aac5d4583a35edaa722851d344b27419`: [acumulativo39017316970](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017316970)frontend1006PASS/28TODO,147archivos,typecheck/build,56pruebas del mecanismo;backend1490PASS/3XFAIL,cobertura88.13%,incluidos8testsX17; [nativo39017316988](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017316988)63/63PASS,21desktop+42tablet/mobile,sin reintentos; [H1d39017316999](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017316999)38PASS.
- [Preflight frontend39017316967](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017316967)/job117351992865SUCCESS:760tests iniciales bajo instrumentación;2627mutantes instrumentados, **ninguna mutación ejecutada por dryRunOnly**, sin puntuación. No cierra S19.
- [Campaña afectada39017317053](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017317053): router/job117351993121 revisado,mutation_frontendRUN con huella82373a097f9762093ad1fa9620f3b3c9695f55c361ab2156d134a518b5a78d73;job117352038619 en curso al corte. Seguridad,backend yLiteNOT_SELECTED/SKIP,noPASS. No cancelar ni relanzar esta campaña equivalente: consultar su resultado/jobs/logs existentes al reanudar. No inferir puntuación del preflight ni del estado en curso.
Alcance: fixture canónico, rutas predeterminadas examinadas y3perfilesChromium. Guarda de eventos de auditoría Python, no auditoría universal del kernel/C/extensiones ni prueba de todos los comandos,SO,motores,teclas o botónReusar. SG28_EVALUATE_ISOLATION permanece0 por defecto; el proceso de cálculo aislado opt-in no se certifica con esta guarda. Corrección solo en conversión frontend de Plus; sin motor matemático,dependencias,permisos ni límites modificados.
GlobalOPEN,porcentajeND. S25/S19integrales,SY-P23,X04Plus/X14Plus,H2/SG28/DIST y punteroREADME de main conservan estado. TODO/XFAIL/SKIP no sonPASS. Los checkpoints documentales no activaron Actions.
**Siguiente único: SY-X-18-BILATERAL**, fuente `__import__('os').system('ls')`, error de sintaxis sin ejecutar nada. Primero actualizar estado de la campaña39017317053 existente; después probar el caso independiente con detección/guardas de ejecución y controles sintéticos, sin invocar el comando ni evaluar código Python no confiable. Preservar fuente/oráculo,recuperación/reentrada y3perfiles; no repetir bloqueos sin cambio de precondición.
