# Current Certification State

Actualizado: 2026-10-07
Alcance coordinado: Lite + Plus
Rama activa: `qa/syntax-audit-in625-a1`

## Baseline
- Oracle Audit: 74/74 shards.
- 2,132/2,132 casos planificados.
- 4,026 casos canónicos.
- 3,451/3,451 legacy representados.
- promoted legacy oracle: 2,823/3,448 verificados; 625 restantes forman IN625.
- canonical oracle: 3,399/4,026.
- blocking verified: 1,357.
- Product Certification Wave 2: PASS en Lite y Plus, 22/22.

## IN625
Bloques cerrados y verdes en ambos motores:
A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D1, D2, D3, E1a, E1b, E1c, E1d, E2a, E2b, E2c, E3a, E3b, E3c, E3d1, E3d2, E3d3, F1, F2a, F2b, F3a, F3b, F3c, G1a, G1b automatizable y G2.

G1 manual/capability:
- TC17
- TC23

G2 manual/config-dependent:
- EN-CH-11: decimal coma real / locale.

## G2 — CERRADO
Se normalizaron únicamente equivalencias de representación del harness, sin cambiar producto:
- EN-CH-06: `sin^2(x)` ↔ `sin^2x`
- EN-CH-07: `sin^-1(x)` / `sin^(-1(x))` ↔ `sin^-1x`
- EN-CH-12: `abs(x-1)` ↔ `|x-1|`

Evidencia:
- Lite Playwright `37580506336` — SUCCESS.
- Plus Playwright `37580510564` — SUCCESS.
- Lite HEAD documental posterior: Playwright `37581518369` — SUCCESS.

## G3 — entradas inválidas y mensajes de error: CERRADO 34/34.
- Lite: 26 parser-level raw + 8 E2E preservables por MathLive.
- Lite E2E run `37722856327`: SUCCESS en desktop/tablet/mobile.
- Lite parser run `37722856334`: SUCCESS.
- Plus: G3 ya certificado 34/34 con Playwright + backend parser.
- La separación por capa preserva cobertura completa: entradas canonicalizadas por MathLive se validan antes del editor; entradas que sí atraviesan UI se validan E2E.

Siguiente bloque activo: H1 — 30 casos de reentrada / output-as-input.

## Siguiente paso exacto — H1d (EN-RE-24..30)
1. Localizar los siete casos H1d en la matriz vigente y confirmar sus tests y harness en Lite y Plus.
2. Verificar HEAD y Actions completos; las consultas por SHA no muestran todas las corridas.
3. Reconciliar EN-RE-29 y EN-RE-30 con MANUAL_CAPABILITY_GAPS.md sin contarlos como PASS.
4. Ejecutar pruebas automatizables H1d y gate acumulativo en ambos motores; clasificar cada rojo antes de corregir.
5. Actualizar CURRENT_STATE y EXECUTION_LOG en ambos repositorios con commits, runs, evidencias y próximo paso. Solo avanzar a H2 tras cierre bilateral.

### Reconciliación documental 2026-10-08
- G3 y H1a–H1c ya constan cerrados; H1d no tiene cierre nuevo verificado.
- HEAD previos a este ajuste: Lite a9627f4d67f141c0346a19c467656d626e3affcc; Plus 802eea7d7a9abf2ec28f2fa46d97a40c67e5296f.
- H1c: jobs SUCCESS Lite 37794754460; Plus 37794867403.
- No se ejecutaron pruebas ni se modificó código de producto en esta reconciliación.

## Continuidad repo-native
El bootstrap oficial es `qa/certification/CONTINUATION_PROMPT.md`. No se necesita ZIP de handoff mientras GitHub y estos archivos estén accesibles.

H1a — EN-RE-01..08: CERRADO 8/8 en Lite y Plus. Lite `37771014887`, Plus `37771019348`.
Siguiente bloque: H1b — EN-RE-09..16: CERRADO 8/8 en Lite y Plus.
- Lite run `37778832819`: SUCCESS.
- Plus run `37790101494`: SUCCESS.
- Correcciones permanentes: reentrada de listas de soluciones, matrices naturales, extracción exacta de salida Plus, preservación de unión de intervalos y formatos numéricos.
- Siguiente bloque: H1c — EN-RE-17..23: CERRADO con 6/6 automáticos PASS + 1 CAPABILITY GAP explícito.
- Lite run `37794754460`: SUCCESS.
- Plus run `37794867403`: SUCCESS.
- Automáticos PASS: EN-RE-17, 18, 19, 20, 21 y 23.
- EN-RE-22: capability gap documentado; el historial aún no restaura el LaTeX original al campo principal.
- Siguiente bloque: H1d — EN-RE-24..30.

### Auditoría del harness H1d — 2026-10-08 (sin corrida nueva)
- Se localizaron los specs de cinco pruebas automatizadas: Lite `e2e/in625-h1d-reentry.spec.ts` y Plus `frontend/e2e/in625-h1d-reentry.spec.ts`.
- Se localizaron ambos workflows `.github/workflows/in625-h1d-reentry.yml`, configurados para `pull_request` y `workflow_dispatch`; cada uno ejecuta Chromium desktop.
- EN-RE-24 prueba idempotencia textual normalizada de 20 inputs y tercera reentrada. La igualdad textual no equivale por sí sola a equivalencia matemática: revisar oráculo contra las reglas canónicas.
- EN-RE-25 lleva el título «equivalencia semántica» pero solo exige que la segunda salida no esté vacía. CLASIFICACIÓN: hueco de ORÁCULO/HARNESS, no defecto de producto acreditado.
- EN-RE-26 comprueba únicamente aceptación/no vacío de formatos cruzados, no garantiza resultado matemático correcto. ORÁCULO parcial.
- EN-RE-27 valida presencia de patrones textuales de asin/atan y EN-RE-28 comprueba `cases|x`; ambas necesitan una verificación de semántica más fuerte para certificación plena.
- EN-RE-29/30 permanecen en MANUAL_CAPABILITY_GAPS como capacidades no expuestas; no contarlos como PASS.
- **No hay ejecución H1d nueva verificada** ni clasificación de fallos de producto; no se han modificado motores. No declarar H1d cerrado.
- Siguiente paso: reforzar primero los oráculos de H1d (usando referencias matemáticas independientes, no solo no-vacío), luego disparar y comprobar los workflows H1d en ambos repositorios y registrar runs, resultados y gate acumulativo antes de H2.

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
