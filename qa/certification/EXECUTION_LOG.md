# Certification Execution Log

Registro acumulativo. No reemplaza `CURRENT_STATE.md`; conserva decisiones y evidencia histórica.

## 2026-10-07 — Migración de continuidad repo-native cerrada
- Se confirmó `qa/certification/` como fuente canónica en Lite y Plus.
- Se formalizó `CONTINUATION_PROMPT.md` como único bootstrap estable para nuevas sesiones.
- Se estableció que chat, ZIPs y handoffs históricos no son autoridad operativa cuando el estado canónico está disponible.
- Se reforzó la obligación de sincronizar `CURRENT_STATE.md` y este log en ambos repositorios tras cada avance sustantivo.

## 2026-10-07 — G2 cerrado bilateralmente
- EN-CH-06, EN-CH-07 y EN-CH-12 se resolvieron como equivalencias de representación/canonicalización del harness, sin cambio de producto.
- Lite Playwright `37580506336` — SUCCESS.
- Plus Playwright `37580510564` — SUCCESS.
- Lite corrida documental posterior `37581518369` — SUCCESS.
- G2 queda cerrado.
- EN-CH-11 permanece manual/config-dependent por decimal coma real / locale.
- Siguiente bloque activo: G3, 34 casos de entradas inválidas y mensajes de error.


## 2026-10-07 — G3 diagnóstico inicial
- Lite `37583041099`: fallo real de G3; 30 IDs en rojo. Se separó error semántico claro de mensajes CAS genéricos y aceptación silenciosa.
- Plus `37583044889`: 102 fallos por harness (`hideMathLiveKeyboard` inexistente), no producto.
- Se verificó contra la matriz original que G3 exige feedback semánticamente claro.
- Lite: validación estructural previa al CAS en `5eac718b9b8d33d9da9a06a688aca0204bd1fb13`.
- Lite: división por cero -> DOMAIN_ERROR claro en `0b7cd3a20fa4d147af321ffd7748ce3c899aeb48`.
- Plus: helper G3 restaurado en `4f146ec8572554febddbe7f21f800733c70e4381`.
- Reruns: Lite `37586956770`; Plus `37586831275`.


## 2026-10-07 — G3 harness sincronizado
- Se comprobó que `setValue()` no garantiza el evento `input` usado por React.
- El helper G3 ahora dispara un `InputEvent("input")` después de `setValue()`.
- El helper espera explícitamente feedback final (alert/status) antes de clasificar éxito/error.
- Las corridas `37586956770` (Lite) y `37586831275` (Plus) se consideran diagnósticos de harness no aptos para clasificar producto.
- Nueva evidencia a revisar: Lite `37589106994`; Plus `37589114822`.


## 2026-10-07 — G3 residual reducido
- Lite: los 28 timeouts estructurales se clasificaron como harness/visibilidad; `BasicScientificMode` sí ejecuta `setResult()` al capturar el parse error.
- Lite helper G3 ahora detecta alert/status por presencia y contenido DOM, no por `isVisible()`.
- Plus: EN-ER-03/04 se clasifican como canonicalización válida de MathLive (fracción incompleta -> grupo vacío).
- Plus: EN-ER-13 era producto real; función desnuda alcanzaba SymPy y podía provocar `TypeError: 'property' object is not iterable`.
- Plus ahora rechaza funciones desnudas antes de SymPy.
- Reruns a revisar: Lite `37678678320`; Plus `37678685459`.


## 2026-10-07 — G3 split por capa
- Se comprobó que MathLive canonicaliza siete entradas inválidas antes de que la UI/backend pueda observar la forma cruda.
- IDs movidos a parser-level: EN-ER-05, EN-ER-15, EN-ER-19, EN-ER-20, EN-ER-26, EN-ER-27, EN-ER-31.
- Cobertura total G3 se conserva: 27 E2E + 7 parser-level = 34.
- Lite parser regression: `11d41e9aef438961e8975b6067ae96d88a17440c`.
- Plus parser regression: `7079dd5854fd987249fb07a665900ce754015c96`.
- Runs a revisar: Lite Playwright `37687766493`; Plus Playwright `37687769608`.


## 2026-10-08 — G3 cerrado
- G3 queda CERRADO 34/34.
- Lite: 26 casos raw-parser + 8 E2E preservables por MathLive.
- Lite E2E run `37722856327`: SUCCESS en desktop/tablet/mobile.
- Lite parser run `37722856334`: SUCCESS.
- Plus: G3 34/34 ya certificado previamente con E2E + backend parser.
- Decisión estable: no exigir a MathLive preservar sintaxis cruda que canonicaliza; esos casos se certifican en parser-level sin perder cobertura.
- Próximo bloque: H1 — 30 casos reentrada/output-as-input.


## 2026-10-08 — H1a cerrado
- EN-RE-01..08 cerrados 8/8 en ambos motores.
- Lite H1a run `37771014887`: SUCCESS.
- Plus H1a run `37771019348`: SUCCESS.
- Regresiones permanentes añadidas para serialización/reentrada de resultados.
- Siguiente bloque: H1b — EN-RE-09..16.


## 2026-10-08 — H1b cerrado
- EN-RE-09..16 cerrados 8/8 en ambos motores.
- Lite H1b run `37778832819`: SUCCESS.
- Plus H1b run `37790101494`: SUCCESS.
- Regresiones permanentes añadidas para soluciones múltiples, matrices, intervalos y formatos de reentrada.
- Siguiente bloque: H1c — EN-RE-17..23.


## 2026-10-08 — H1c cerrado
- EN-RE-17..23: 6/6 casos automáticos PASS en ambos motores.
- Lite H1c run `37794754460`: SUCCESS.
- Plus H1c run `37794867403`: SUCCESS.
- EN-RE-22 permanece como CAPABILITY GAP explícito: historial no restaura todavía el LaTeX original al campo principal.
- Siguiente bloque: H1d — EN-RE-24..30.

## 2026-10-08 — Bootstrap permanente en rama predeterminada
- Se creó `qa/certification/README.md` en `main` de Lite y Plus, con puntero a la rama canónica activa.
- Se actualizó `qa/certification/CONTINUATION_PROMPT.md` en la rama canónica para resolver dinámicamente el puntero; ya no contiene un nombre de rama fija.
- Validación: el puntero `main` y el prompt tienen blobs idénticos entre Lite y Plus; la rama activa queda declarada exclusivamente en el puntero de `main`.
- Regla de migración: publicar y verificar primero la nueva rama canónica y después mover ambos punteros en `main`; el prompt único permanece invariable.

## 2026-10-08 — Reconciliación documental de siguiente paso
- README de main en ambos repositorios identifica qa/syntax-audit-in625-a1 como rama canónica.
- El encabezado de CURRENT_STATE mantenía G3 como tarea siguiente aunque G3, H1a, H1b y H1c ya constaban cerrados.
- Se corrigió el siguiente paso a IN625 H1d: EN-RE-24..30, con reconciliación de EN-RE-29/30 contra MANUAL_CAPABILITY_GAPS antes de certificar.
- HEAD inspeccionados antes de las modificaciones: Lite a9627f4d67f141c0346a19c467656d626e3affcc; Plus 802eea7d7a9abf2ec28f2fa46d97a40c67e5296f.
- Los jobs H1c referenciados finalizaron SUCCESS: Lite 37794754460, Plus 37794867403.
- La búsqueda de runs vinculados directamente a los HEAD devolvió cero resultados, sin descartar corridas por otros eventos; no se certifica H1d con ese dato.
- Clasificación: inconsistencia DOCUMENTAL/ESTADO, no fallo de producto. No hubo nueva ejecución de pruebas ni alteraciones al motor.
- Siguiente paso operativo: ubicar matriz/tests H1d, examinar historial completo de Actions, ejecutar cobertura automatizable bilateral y actualizar evidencia.

## 2026-10-08 — Auditoría de cobertura H1d en ambos motores
- Specs localizados: Lite `e2e/in625-h1d-reentry.spec.ts`; Plus `frontend/e2e/in625-h1d-reentry.spec.ts`.
- Workflows localizados: `.github/workflows/in625-h1d-reentry.yml` en Lite y Plus (`pull_request`, `workflow_dispatch`, Chromium desktop).
- EN-RE-24: 20 entradas con triple evaluación e idempotencia normalizada; equivalencia matemática independiente no probada.
- EN-RE-25: el test solo exige salida no vacía y por tanto NO comprueba la equivalencia semántica anunciada. Clasificación: ORÁCULO/HARNESS incompleto.
- EN-RE-26: aceptación sin verificación independiente del resultado. EN-RE-27/28: patrones de texto débiles frente al contrato semántico.
- EN-RE-29/30: gaps capability ya documentados, no PASS automáticos.
- Sin nueva corrida H1d acreditada; no hay rojo de producto probado ni cambios al motor.
- Decisión: reforzar oráculos y luego ejecutar/revisar H1d bilateralmente; conservar H2 bloqueado hasta cierre verificable.

### 2026-10-08 — H1d EN-RE-25: oráculo numérico reforzado
- Se modificó bilateralmente el spec H1d (Lite: `e2e/in625-h1d-reentry.spec.ts`; Plus: `frontend/e2e/in625-h1d-reentry.spec.ts`).
- El test EN-RE-25 ahora exige anclas numéricas independientes para `2+3`, `2^{10}`, `\\frac{3}{4}` y `10^{-3}`, en la primera evaluación y después de la reentrada. Se mantiene la comprobación de no vacío para las restantes entradas; **esto no certifica equivalencia semántica universal**.
- Commits de prueba: Lite `7c358d99c6b150ed2c037f6232100eef5b0e2b09`; Plus `101243e84506271860dbdd17c89eea028efff298`.
- La consulta de runs de PR asociados a esos SHA devolvió 0; el conector no ofrece despacho genérico de `workflow_dispatch`. Por tanto H1d **NO está ejecutado/cerrado** sobre esos commits.
- Siguiente paso exacto: disparar `.github/workflows/in625-h1d-reentry.yml` en ambas ramas con `workflow_dispatch` (o mediante evento PR), verificar IDs y logs, clasificar los rojos, corregir los oráculos pendientes y registrar gate acumulativo.

## 2026-10-08 — H1d: refuerzo de pruebas sin ejecución confirmada
- Specs H1d cambiados: Lite commit `82276fe5febd252e80c18753183c00d4fb01a67e`; Plus commit `8ac4e9105f3ce83d9951084c47be9a5d9d3cdda3`.
- EN-RE-25 ahora exige estabilidad textual normalizada S1→S2 en las 20 expresiones, además de anclas numéricas independientes en cuatro; sigue sin equivalencia matemática externa para los demás casos. Clasificación: refuerzo de oráculo/harness, no corrección de producto.
- EN-RE-24/25 Plus obtuvieron timeout explícito de 120 s; EN-RE-25 Lite se ajustó al mismo límite, evitando depender del timeout predeterminado en iteraciones largas. Este ajuste no prueba que pasen.
- Consulta de Actions vinculados a esos SHA retornó 0 runs; dicha consulta cubre solo eventos PR y no equivale a listar todas las ejecuciones. No se obtuvo run ID H1d, ni PASS/FAIL verificado. Los workflows `.github/workflows/in625-h1d-reentry.yml` requieren `workflow_dispatch` o `pull_request`; el conector disponible no expone despacho directo.
- H1d mantiene estado BLOCKED (CI no verificado); EN-RE-29/30 siguen como capability gaps, no PASS. Próximo paso: iniciar/observar H1d bilateral, diagnosticar rojos y ejecutar gate acumulativo. No iniciar H2 antes del cierre contractual.

## 2026-10-08 — H1d EN-RE-27: regresión de reentrada añadida
- Se extendió el test EN-RE-27 para reintroducir los resultados de `asin(1/2)` y `atan(1)` y exigir estabilidad de la representación canónica S1→S2, además de los patrones originales.
- Commits de test: Lite `c998956cadf87fa2b10a2da49147a78cf74750be`; Plus `148aa26db5c8d65b14776416a672b49590d6fa5d`.
- Clasificación: mejora de HARNESS/ORÁCULO, sin modificar código del producto. La estabilidad textual no certifica por sí misma semántica completa.
- No se obtuvo corrida H1d ni se verificó gate acumulativo para estos SHA. H1d permanece pendiente de ejecución bilateral; H2 no inicia.

## 2026-10-08 — H1d EN-RE-25: referencia racional adicional
- Se incorporó bilateralmente un oráculo independiente para `\\frac{1}{2}+\\frac{1}{3}` = `\\frac{5}{6}` (o forma decimal periódica soportada), validando primera salida y reentrada; se preserva el resto del test.
- Commits: Lite `679e85ee717e44149283d2632765c01c9b7e0783`; Plus `0f40b78ec5a4fa2c8226f092dd170cf34313eb71`.
- Tras commit Lite inició `IN625 Lite Build Diagnostic` run `37859589602`, visto `in_progress`; **no es H1d E2E**.
- Últimos runs H1d observados: Lite `37843775609`, Plus `37843780110`, ambos SUCCESS sobre commits anteriores; **no cubren los últimos cambios de test**.
- H1d continúa abierto: verificar ejecución H1d E2E en ambos SHA nuevos y gate acumulativo, mejorar oráculos pendientes, mantener EN-RE-29/30 como capability gaps. No declarar PASS global por éxito de build.

## 2026-10-08 — Comprobación posterior a corrida de H1d
- Lite Build Diagnostic `37859589602`, `37859621271` y `37859638478`: **SUCCESS**. Estos runs comprueban build, no H1d E2E.
- Último H1d específico encontrado mediante listado de Actions: Lite `37843775609` y Plus `37843780110`, ambos SUCCESS pero anteriores a los últimos cambios de los tests/oráculos; no sirven para certificar el HEAD actual.
- PR de certificación existentes: Lite #48 y Plus #29, abiertos; GitHub informa `mergeable_state=dirty` (conflictos de integración). No fusionar automáticamente.
- Bloqueo actual: no hay run H1d actualizado en ambos HEAD y el conector de esta sesión carece de `workflow_dispatch` genérico. Se requiere ejecutar `in625-h1d-reentry.yml` con el selector de rama activa en ambos repositorios mediante GitHub Actions o mecanismo autorizado equivalente; registrar nuevos run IDs y resultados. No declarar H1d PASS ni pasar a H2.
