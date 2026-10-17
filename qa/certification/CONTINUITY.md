# Continuidad verificable y prevención de ejecuciones redundantes

`continuity.json` es el índice estructurado vigente. No sustituye contratos, logs ni GitHub Actions. `CURRENT_STATE.md` presenta este índice a personas; `EXECUTION_LOG.md` conserva historia. Si difieren, reconciliar evidencia real antes de programar pruebas. El prompt externo es únicamente bootstrap.

## Arranque de cada sesión

1. Resolver repositorio/rama canónica desde README de la rama predeterminada en ambos productos. Leer el índice, protocolo, gaps y contratos del bloque. No heredar SHA del chat.
2. Consultar HEAD y runs recientes **incluidos push y pull_request**, paginando hasta encontrar los gates de interés. Incluir intentos repetidos, jobs y logs. Un listado PR vacío no significa ausencia de runs push.
3. Generar observaciones desde esa consulta y ejecutar el planificador. El archivo de observaciones es temporal, no una copia del ledger. Los snapshots caducan a los 15 minutos. Antes de cada publicación/dispatch volver a consultar HEAD/runs aunque todavía no haya caducado el snapshot.
4. Para cada gate, comparar su huella de insumos con ejecuciones anteriores. Una huella distinta requiere ejecución; la misma huella en curso requiere esperar/inspeccionar; la misma huella fallida requiere diagnóstico; evidencia aprobada revisada permite reutilización con el SHA de origen explícito. No crear commits vacíos, modificar documentación artificialmente ni relanzar un gate verde para despertar CI.
5. Antes de publicar, releer HEAD y usar actualización de referencia con `expected_sha`. Si cambió, reconciliar/rebasar y recalcular; no sobrescribir trabajo de otra sesión. No existe un lock permanente: una sesión interrumpida no debe impedir a la siguiente continuar. Para una corrida en curso, GitHub es autoridad. Un campo local de intención de trabajo no equivale a una corrida ni reserva exclusividad.
6. Publicar cambio técnico consolidado, comprobar que el push activa el workflow correcto para ese SHA y registrar su ID. Las actualizaciones posteriores del índice y prosa no deben despertar E2E. No repetir despacho manual si apareció el run esperado. La concurrencia de workflows es una segunda defensa contra eventos duplicados/obsoletos, no una evidencia de aprobación.

## Huella y alcance

`scripts/certification/continuity.py` usa SHA-256 sobre ruta, modo, tipo y OID Git de todos los insumos seleccionados, configuración del gate y versión del planificador. Incluye adiciones, cambios y eliminaciones. Por defecto los gates usan `inputs: ["*"]`, cobertura conservadora de todo el árbol. Las únicas exclusiones son las rutas **exactas** declaradas como prosa y el índice `continuity.json` para evitar autorreferencia. Los objetos `tree` intermedios no son insumos; blobs, symlinks y submodules sí.

No excluir `qa/certification/**`: fixtures JSONL, verificadores, contratos de aceptación, scripts, tests, workflows, dependencias y lockfiles son insumos. Los contratos `.md` no están en la lista de prosa. Cambiar criterios externos exige incrementar `acceptance_revision` y revisar la evidencia contra esos criterios; un run antiguo sin esta revisión queda REVIEW. La revisión no se infiere del color verde.

`technical_baseline_sha` identifica evidencia histórica y **no es HEAD**. Un commit documental puede tener SHA distinto conservando huella técnica. No escribir el SHA del propio commit dentro del índice: es imposible hacerlo sin crear otra revisión. El planificador usa el HEAD observado externamente y devuelve SHA de evidencia, nunca inventa una ejecución en HEAD.

La selección conservadora puede ejecutar de más cuando cambia un insumo ajeno al gate. Solo reducir `inputs` tras revisar dependencias reales y añadir pruebas de que no excluye regresiones. El planificador no altera checks requeridos ni sustituye los gates de cierre.

## Formato de observaciones

Ejemplo de estructura (los placeholders deben reemplazarse con datos de GitHub):

```json
{
  "repository": "c2melendez/precision-lab-lite",
  "branch": "RAMA_CANONICA_VERIFICADA",
  "head_sha": "SHA_HEAD_VERIFICADO",
  "fetched_at": "ISO8601_UTC_DE_LA_CONSULTA",
  "runs": [{
    "id": 123,
    "path": ".github/workflows/in625-cumulative-certification.yml",
    "head_sha": "SHA_DEL_RUN",
    "created_at": "ISO8601_UTC_DEL_RUN",
    "run_attempt": 1,
    "status": "completed",
    "conclusion": "success",
    "jobs": [{"id": 456, "conclusion": "success"}],
    "logs_reviewed": false,
    "evidence_executed": false,
    "acceptance_revision": null
  }]
}
```

`logs_reviewed=true` solo después de comprobar logs, casos esperados, TODO/XFAIL/SKIP y alcance. No significa ausencia de TODO: esos casos se excluyen expresamente del PASS. `acceptance_revision` se acredita después de revisar que esa ejecución satisface los criterios actuales del gate, incluidos canales/perfiles. Los jobs deben enumerarse completos; no omitir jobs rojos u omitidos para lograr REUSE. Una prueba omitida exige revisión y constancia de su límite: jamás convierte una capability pendiente en PASS. El índice guarda evidencia por canal, no una certificación global por color del workflow.

`evidence_executed=true` requiere revisar mediante API los pasos obligatorios del job y sus logs: las pruebas deben haberse ejecutado realmente. Un job verde con todos sus pasos de prueba omitidos por el guard no es evidencia de ejecución. Si el guard anuncia REUSE, resolver la cadena hasta el run de origen, consultar sus jobs/pasos/logs, comprobar huella y criterios y registrar ese origen como evidencia; no atribuir pruebas al run que solo reutilizó. Una cadena sin origen ejecutado verificable permanece REVIEW. Nunca asignar `logs_reviewed` ni `evidence_executed` por el color verde.

Con checkout limpio en el HEAD consultado:

```sh
python scripts/certification/continuity.py --observations /tmp/observations.json
python -m unittest discover -s scripts/certification -p 'test_*.py' -v
```

Sin checkout, los conectores pueden recuperar árboles recursivos GitHub por **commit exacto** de HEAD y runs anteriores. Preparar `manifest.json` con `{"commits":{"SHA":{"tree":[{"path":"archivo","mode":"100644","type":"blob","sha":"OID"}],"truncated":false}}}`. El vínculo clave SHA/árbol debe proceder de la consulta GitHub, no de una asociación inventada. Árbol truncado o incompleto se rechaza. Guardar estado local y ejecutar:

```sh
python scripts/certification/continuity.py --repo /ruta/snapshot --state qa/certification/continuity.json --manifest /tmp/manifest.json --observations /tmp/observations.json
```

En CI se puede emitir una huella auditable, sin declarar evidencia:

```sh
python scripts/certification/continuity.py --fingerprint cumulative --sha "$GITHUB_SHA"
```

El JSON emitido puede guardarse como artefacto del run. No es una firma criptográfica del servicio ni permite confiar en archivos de observaciones aportados por terceros. El planificador es deliberadamente offline y requiere observaciones confiables de GitHub; no despacha ni cancela workflows. Se puede aplicar el mismo algoritmo mediante herramientas de conector cuando no haya Python, conservando sus precondiciones.

## Decisiones

| Decisión | Acción de la sesión |
|---|---|
| RUN | Preparar/usar el disparador técnico pertinente; comprobar primero que no apareció un run equivalente. |
| WAIT | Consultar jobs/logs del run existente. Continuar trabajo independiente. |
| REUSE | Referenciar run/SHA original y huella; no afirmar una ejecución nueva o cierre global. |
| DIAGNOSE | Clasificar producto/harness/oráculo/capability/infra. Probar focalmente; nuevo gate completo tras una corrección consolidada. Un retry por fallo transitorio exige razón y evidencia en el log. |
| REVIEW | Revisar jobs/logs/criterios o causa de cancelación; no despachar automáticamente ni acreditar PASS. |
| REFRESH | Actualizar HEAD, objetos o metadata; ningún resultado se reutiliza con un snapshot vencido. |

Los bloqueos del índice mantienen condición de salida y siguiente acción. Solo repetir una prueba de capability si cambió la precondición que podía resolverla; un preflight verde de runners no certifica DIST. Un fallo persistente sin cambio de insumos se diagnostica, no se combate con una secuencia de reruns idénticos.

## Contratos Markdown y filtros CI
Los contratos EXECUTION_PROTOCOL, SG28_DISTRIBUTED_ACCEPTANCE, SY_P_23_CONVENTION, SY_X_04_LENGTH_CONTRACT, SY_X_04_LENGTH_DECISION y SG28_INTEGRATION_EXIT_CRITERIA se incluyen explícitamente en filtros como excepciones técnicas al Markdown. Los snapshots/logs/tablero/prompts y archivos históricos son prosa de cierre; no despiertan CI. Al añadir un contrato ejecutable, actualizar los filtros y acceptance_revision.

## Selección por componente de campañas QA — 2026-10-17

En Plus, `scripts/certification/campaign_scope.py` controla exclusivamente la selección automática del wrapper QA de dependencias. Los eventos PR y main de los workflows llamados conservan su selección completa. El despacho manual exige un motivo no vacío y revalida todo; no reutiliza automáticamente seguridad.

| Perfil | Insumos de origen | Ejecución |
|---|---|---|
| security_frontend | package.json/lock y .npmrc de frontend | npm audit fresco cuando se selecciona |
| security_backend | backend completo y contrato ejecutable del job | pip-audit, Bandit y regresiones frescos |
| mutation_frontend | frontend conservador y fixtures JSONL; E2E solo no selecciona campaña | Stryker del checkout Plus |
| mutation_backend | backend conservador y fixtures JSONL | mutmut y pruebas de sus superficies críticas |
| mutation_lite | config stryker-lite y contrato del job, que fija repo/ref/tooling | Lite histórico6cbec764; no HEAD Lite actual |

La huella SHA-256 incluye perfil, patrones, versión de política, pasos obligatorios, modo/tipo/OID de archivos y contrato del job. Del contrato se excluyen únicamente las líneas superiores de selección `if` y dependencia `needs`; se conservan comandos, versiones, variables, timeouts y checkout/ref. Cambiar el pin, las herramientas o pasos cambia el contrato y vuelve a seleccionar el job afectado. Cambiar solo orquestación ejecuta sus pruebas de enrutamiento, sin lanzar campañas completas para probar el selector.

Para mutación seleccionada, se consulta historia reciente paginada y jobs del intento correcto. Un equivalente en curso produce WAIT; un fallo/cancelación posterior produce DIAGNOSE. Un verde sin revisión explícita produce REVIEW. REUSE exige job y pasos ejecutados realmente, huella idéntica y registro `campaign_evidence_reviews` con revisión de logs y mutaciones ejecutadas. La revisión histórica no prevalece sobre una ejecución equivalente más reciente aún abierta. Una falla de seguridad de otro componente no borra la evidencia independiente de un job aprobado, pero el workflow padre continúa sin acreditar cierre integral.

Ante diff o consulta incompletos se ejecutan los checks afectados de forma conservadora. NOT_SELECTED/WAIT/REVIEW/DIAGNOSE y jobs omitidos no son PASS. REUSE no es ejecución nueva ni mutation score nuevo. Los criterios de certificación global no se reducen por el color verde de un wrapper de selección.

Ejemplo offline (no despacha ni cancela):
```sh
python scripts/certification/campaign_scope.py --paths /tmp/changed-paths.json --event push
python scripts/certification/campaign_scope.py --fingerprint mutation_lite --sha SHA_VERIFICADO
python -m unittest discover -s scripts/certification -p 'test_*.py'
```

El JSON de paths debe proceder del diff real; sin credenciales, la inspección offline de un perfil afectado no podrá reutilizar evidencia y devolverá RUN conservador. Para inspección pura de reglas puede llamarse `select(paths,event,reason)`. El Job Summary conserva decisión y enlace al run de origen. No despachar una campaña solo porque aparezca REVIEW: completar la revisión o cambiar la precondición documentada.


## Última reconciliación — SY-X-08
Baselines Plus 948d6dbb501e79b9e4fca13548586ca7a88d9a80 y Lite 378510f0092d4c50c321fc59ce1abb87e732aa72. Usar next_action SY-X-09 y las corridas X08 del índice. Campaña38995800990 ya existe; backendmutmut117288029927 ya SUCCESS con logs revisados; inspeccionar solo frontend117288029860 en curso, no relanzar. Campaña38992878940 finalizada:backendmutmutPASS,frontendCANCELLED con Worker exit1/sin informe;DIAGNOSE para misma huella. Commit e2e-only posterior no activó otra campaña. Prosa no dispara CI;reutilizar evidencia técnica tras comparar huellas.


## Reconciliación SY-X-13 — 2026-10-17
El índice revisión31 tiene baseline técnico X13 y siguiente único X14. CURRENT_STATE obsoleto con encabezado X09 fue archivado como prosa excluida, sin perder casosX09..12. Usar los runs X13 del índice, comparar huellas y revisar logs antes de REUSE. X13 no activó nuevas campañas;38995800990frontend ya CANCELLED/sin informe, no en curso. No relanzar equivalentes para actualizar documentación. Reentrada nativa X13 usa LaTeX ln real; el texto SymPy log no es la gramática pública log10.


## Si README de la rama predeterminada no contiene el puntero canónico
1. Consultar metadatos del repositorio y del run de Actions aportado por el usuario: obtener default_branch y head_branch reales, sin asumir que main es la rama de certificación.
2. Leer qa/certification/continuity.json en la rama candidata del run y en el producto pareado. Exigir que canonical_branch coincida con la candidata en ambos y verificar HEAD, runs recientes, protocolo y siguiente tarea. Los IDs antiguos solo permiten descubrir la rama; no acreditan el estado actual.
3. Si no hay run de referencia, enumerar ramas y buscar el índice y README de certificación. Elegir solo con evidencia bilateral consistente y vigente. Si hay varios candidatos incompatibles, continuar la inspección y aclarar la ambigüedad antes de publicar; no escoger por memoria del chat o número de revisión aislado.
4. No reiniciar desde el estado S26 histórico de main ni repetir pruebas por ausencia del puntero. No cambiar default_branch, mover referencias ni lanzar CI para descubrir dónde estamos.
5. El puntero en README predeterminado puede corregirse mediante un cambio documental acotado; mientras falte, la recuperación por Actions + índices bilaterales verificados mantiene la continuidad. Esta regla es genérica, no un snapshot de un caso o SHA.

X14: reutilizar evidencia de rechazo Plus revisada hasta cambiar profundidad30 y nodos200; XFAIL no es PASS. Siguiente caso independiente X15.


## Reconciliación SY-X-15 — 2026-10-17
Índice revisión35: baseline técnico X15 y siguiente único X16. Conservar los runs del índice y comprobar huellas antes de REUSE. El control positivo del detector es un test separado: no atribuir su nodo script inerte al resultado de producto ni convertir este fixture en auditoría XSS universal. No nueva campaña de dependencias/mutaciones; S25/S19 siguen abiertos y X14Plus no pierde su XFAIL. La actualización documental no requiere CI nueva.


## Reconciliación SY-X-16 — 2026-10-17
Índice revisión37: baseline técnico X16, siguiente único X17. Guardar y comparar las huellas de los runs del índice; los controles sintéticos son pruebas separadas, no accesos reales al host. Un intento bloqueado haría fallar el caso; cero intentos no se infiere de bloquearlos. Sin lectura del objetivo ni campaña de dependencias/mutaciones. Mantener S25/S19 y X04Plus/X14Plus abiertos; prosa no requiere nuevaCI.


## Reconciliación SY-X-17 — 2026-10-17
Índice revisión40: baselineX17, siguienteX18. Reutilizar los tres gates pertinentes solo tras observaciones frescas y huellas equivalentes. Fallo nativoPlus39017066935 diagnosticado PRODUCT_CONVERSION; corrección02a8f689 y nativo39017316988verificados. La nueva corrida tuvo un cambio técnico, no fue reintento idéntico. Campaña39017317053/job117352038619 en curso al corte: inspeccionar esa ejecución, no relanzarla. Preflight760tests/2627instrumentados no ejecutó mutaciones ni mide score. S19globalOPEN. Preservar todos los bloqueos. Cambios de prosa no requieren CI.


## Reconciliación SY-X-18 — 2026-10-17
Índice revisión42: baselineX18, siguienteX19. Tresgatespertinentes revisados porSHA; comparar huellas y observaciones frescas antes deREUSE. Helperdeprocesos compartido conserva7controlesX17 sin duplicarlos;X18comprueba cero llamadas aparse_expr para el original y recupera con evaluador restaurado. Campaña39017317053/job117352038619reconciliadaCANCELLEDconWorkerexit1instrumentado,sininforme/score. No seguir esperando ese run ni relanzarinputsidénticos; S19OPENyrequiere diagnóstico. Sin nuevascampañas; los cambiosdocumentales no requierenCI.


## Reconciliación SY-X-19 — 2026-10-17
Índice revisión44: baselineX19, siguienteX20. Tresgatespertinentes porSHA revisados; comparar huellas y observaciones frescas antes deREUSE. Helperopencompartido conserva1controlX16;helperprocesos7controlesX17sin duplicarlos. X19cero intentos auditadosdeopen/procesosycero llamadasdeloriginalaparse_expr; evaluadorrestauradopararecuperación. Nuncaseabre/leeelobjetivoparaprobarlo. S19cancelado ybloqueosanteriores permanecenOPEN;sin nuevascampañas. Prosa no requiereCI.
