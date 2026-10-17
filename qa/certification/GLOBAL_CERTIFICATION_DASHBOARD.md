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
| SY-X |22|X01–03,X05–08 PASS acotado bilateral;X04Plus BLOCKED;X09–22 pendientes.|
| Total | 309 | Fixture común intacto; certificación integral OPEN. |

Las cifras son filas de la matriz, no totales de PASS. Consultar evidencia vigente de cada canal en el índice y el log. TODO/XFAIL/SKIP y pruebas manuales no se suman a PASS. IN625, Syntax309 y campañas anteriores no son denominadores sumables sin deduplicar requisitos.

## Áreas de cierre

| Área | Estado | Acción |
|---|---|---|
| Científica y matrices matemáticas | PARCIAL | Continuidad del caso vigente y reconciliación de canales. |
| H2/SG28/DIST | OPEN/BLOCKED | Contrato de vigencia/fencing, integración HTTP y luego aceptación multihost. |
| Seguridad npm/S25 | BLOCKED | Parche compatible o migración validada; mantener gate estricto. |
| Mutación S19 | PENDIENTE de evidencia actual | Gate focalizado del lote técnico, no reejecuciones sin diagnóstico. |
| UI Plus | PARCIAL | X01–03,R12–14,X05–08 nativo30/30 PASS;otroscanales pendientes. |
| Gráficas/Matrices/Estadística/Unidades | PARCIAL; requisitos ND | Vincular operaciones y flujos a requisitos únicos. |
| Geometría | PENDIENTE de inventario reconciliado | Localizar contrato, implementación y pruebas. |
| Visual/responsive/accesibilidad | PARCIAL | Reconciliar matriz S26 y capturas/SHA; perfiles Chromium no prueban todos los motores/SO. |
| Teclado/historial/reusar/compartir/persistencia | PARCIAL/MANUAL | Revisar gaps vigentes por canal, sin extrapolar desde reentrada programática. |
| Paridad final | OPEN | Mismo requisito y canal, no simple comparación de cantidad de tests. |

[Tablero anterior archivado](history/2026-10-16_pre_continuity_GLOBAL_CERTIFICATION_DASHBOARD.md), [estado](CURRENT_STATE.md), [protocolo](EXECUTION_PROTOCOL.md), [historial](EXECUTION_LOG.md), [gaps](MANUAL_CAPABILITY_GAPS.md).

## Último corte verificado

## 2026-10-17 UTC — SY-X-08 bilateral verificado
Lite SHA `378510f0092d4c50c321fc59ce1abb87e732aa72`; Plus SHA `948d6dbb501e79b9e4fca13548586ca7a88d9a80` (solo corrección de oráculo nativo sobre `122711fc0161468d8cb619b6ad2aa9a88295b5eb`).
Fixture original `\sqrt{-1}`, esperado «en ℝ: error claro; en ℂ: i». Los canales generales ensayados ya son complejos principales: antecedentes SY-E-17/18 y SY-R-08, Algebrite Lite y servicio evaluate Plus. No existe un selector ℝ aplicado a estos flujos; no se cambió el dominio ni se inventó un rechazo real. Otros canales restringidos a reales conservan su contrato y no reciben PASS de esta evidencia.
Ingesta exacta MathLive de la fuente original; salida exacta i visible y reentrada del resultado real; control i²=-1 y recuperación 2+3=5 con reentrada, cinco IDs distintos y cero pageerrors por perfil. Lite usa Worker real en navegador; Plus HTTP real y resultado MathResponse, aproximación real nula para i. Pruebas locales independientes añaden sqrt(-4)=2i y ausencia de símbolos libres/Float en HTTP.
- Lite [acumulativo38995803426](https://github.com/c2melendez/precision-lab-lite/actions/runs/38995803426):1601 PASS/30 TODO,183 archivos,typecheck/build,34 pruebas del mecanismo. [Nativo38995803418](https://github.com/c2melendez/precision-lab-lite/actions/runs/38995803418):408/408 PASS,desktop/tablet/mobile Chromium,sin reintentos. [H1d38995803385](https://github.com/c2melendez/precision-lab-lite/actions/runs/38995803385):21 PASS.
- Plus [acumulativo38995949507](https://github.com/c2melendez/precision-lab-plus/actions/runs/38995949507):frontend1005 PASS/28 TODO,146 archivos,typecheck/build;backend1468 PASS/2 XFAIL,cobertura88.00%;56 pruebas del mecanismo. [Nativo38995949534](https://github.com/c2melendez/precision-lab-plus/actions/runs/38995949534):30/30 PASS (10desktop+20tablet/mobile),sin reintentos. [H1d38995949509](https://github.com/c2melendez/precision-lab-plus/actions/runs/38995949509):38 PASS.
El primer nativo Plus38995800956 falló9PASS/1FAIL porque KaTeX mostró U+2212 frente a menos ASCII en el control -1, después de aprobar i y reentrada. Clasificado harness; se normaliza únicamente el signo visible, sin cambiar motor, respuesta ni oráculo matemático.
Campaña previa38992878940 ya completada: backendmutmut117278929669SUCCESS con mutaciones ejecutadas y logs revisados; frontend117278929718CANCELLED, logs contienen Vitest Worker exit1 en BasicModeConversionError.test.tsx y cancelación posterior, sin informe final. No se infiere score ni causa última de la cancelación. Misma huella cancelada requiere DIAGNOSE, no retry automático.
Campaña X08 [38995800990](https://github.com/c2melendez/precision-lab-plus/actions/runs/38995800990):nuevos insumos de pruebas en frontend/backend; audit56PASS, seguridadbackend117288027634PASS (pip-audit sin vulnerabilidades conocidas,Bandit sin incidencias,24tests); mutaciones117288029860/117288029927 en curso al corte. Frontendnpm yLitepin SKIPPED por alcance, no PASS. La corrección posterior e2e-only no activó otra campaña. Conservar los IDs e inspeccionar sus resultados, sin dispatch duplicado.
Gaps: MathLive asignación/input en tres perfiles Chromium, no cada tecla/SO/otro motor/botónReusar. Ningún TODO/XFAIL/SKIP es PASS. S25 (5high), S19 integral, SY-P23, SY-X04 Plus, H2/SG28/DIST y certificación global continúan abiertos. Próximo único SY-X-09-BILATERAL: potencia99999999999^{99999999999}, límites anunciados y recuperación; no ejecutar la potencia sin límites de recursos.
