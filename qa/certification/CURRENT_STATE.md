# Estado vigente de certificación — Precision Lab Lite / Plus

Corte:2026-10-17 UTC/Honduras. Global **OPEN**; porcentaje reconciliado **ND**.

**Siguiente tarea única: SY-X-17-BILATERAL — READY.** X16 PASS acotado: comando de archivo rechazado, cero intentos observados al objetivo y recuperación. Verificar HEAD/Actions e índice antes de actuar. X04Plus/X14Plus siguen bloqueados.

## 2026-10-17 UTC — SY-X-16 bilateral verificado
Fixture original `\input{/etc/passwd}` y oráculo intactos: comando ignorado/rechazado, sin lectura del archivo objetivo. No se abre ni se lee ese archivo para preparar el test o comparar su contenido.
Lite rechaza el comando desconocido en parser y en handler Worker real con transporte simulado. Plus HTTP real responde JSON de error, sin resultado, bajo una guarda de eventos Python open: cero intentos observados sobre el objetivo y recuperación5/reentrada con tresIDs distintos. El control positivo emite solo sys.audit(open,objetivo), sin llamar a open ni leer archivos; exige detección y bloqueo. Los hooks quedan inactivos al salir de cada contexto.
En navegador, MathLive ingiere el comando y conserva el identificador y la ruta en la serialización. Se exige aviso claro y ausencia de resultado matemático, solicitudes al objetivo, diálogos, descargas, filechooser y pageerrors, antes de calcular, tras el rechazo y tras recuperar. Worker Lite/HTTP Plus reales recuperan2+3=5 y reintroducen5 con dosIDs exitosos distintos.
La guarda de red bloquea preventivamente cualquier solicitud al objetivo y la registra: un intento, aunque bloqueado, haría fallar el caso. La aprobación exige cero intentos, no se infiere seguridad del bloqueo por sí solo. Un control aislado solicita únicamente una ruta sintética inexistente y exige una detección; nunca intenta obtener el archivo real. Las copias del helper son idénticas y están incluidas en los filtros de push/PR pertinentes.
- Lite SHA `b12aecc02f06086f1d4d8da91a26bd7b3bc3ae4f`: [acumulativo39016377044](https://github.com/c2melendez/precision-lab-lite/actions/runs/39016377044)1616PASS/30TODO,191archivos,typecheck/build,34pruebas del mecanismo. [Nativo39016377039](https://github.com/c2melendez/precision-lab-lite/actions/runs/39016377039)438/438PASS,incluidos fixture y control sintético en3perfiles,sin reintentos observados. [H1d39016377064](https://github.com/c2melendez/precision-lab-lite/actions/runs/39016377064)21PASS.
- Plus SHA `7bca63077a2225103c515c53d94a6002293835d6`: [acumulativo39016375092](https://github.com/c2melendez/precision-lab-plus/actions/runs/39016375092)frontend1005PASS/28TODO,146archivos,typecheck/build;backend1482PASS/3XFAIL,cobertura88.11%,56pruebas del mecanismo. [Nativo39016375110](https://github.com/c2melendez/precision-lab-plus/actions/runs/39016375110)60/60PASS (20desktop+40tablet/mobile),sin reintentos. [H1d39016375096](https://github.com/c2melendez/precision-lab-plus/actions/runs/39016375096)38PASS.
Nuevos tests locales:2Lite y2PlusPASS. Cada suite nativa incorpora3ejecuciones del fixture y3controles sintéticos; los totales son pruebas, no requisitos independientes. Se revisaron pasos/logs por SHA, incluida ejecución efectiva. No se inventa una llamada inválida HTTP/Worker desde UI si el rechazo es local; el rechazo raw del servicio/handler se acredita aparte.
Sin cambios al motor, renderizadores, dependencias, permisos ni límites. Sin campaña nueva de dependencias/mutación ni dispatch duplicado; las regresiones de bloqueos anteriores siguen en el gate acumulativo sin campaña dirigida a reintentar sus precondiciones invariables.
Alcance: fuente canónica y rutas examinadas, eventos Python open y solicitudes del navegador; no auditoría universal del filesystem/kernel, comandos, teclas/SO/motores ni botónReusar. Global OPEN, porcentaje ND; S25/S19 integrales, SY-P23, X04Plus/X14Plus y H2/SG28/DIST mantienen sus bloqueos. TODO/XFAIL/SKIP no son PASS.
**Siguiente único: SY-X-17-BILATERAL**, fuente write18{ls}, ignorada/rechazada sin ejecución. Instrumentar intentos de iniciar procesos/shell con controles sintéticos, sin ejecutar el comando para probarlo; preservar fuente, recuperación y evidencia nativa por SHA.

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
