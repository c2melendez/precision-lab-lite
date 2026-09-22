# LOG — Auditoría de Módulos A-D (motor matemático) + rediseño de teclado

Fecha: septiembre 2026. Alcance: auditar el trabajo entregado en
`precision-lab-lite-main_CORREGIDO.zip` contra `spec_motor_matematico_pendiente.md`,
`plantilla_modulos_motor_matematico.md` y `spec_teclado_virtual.md`, verificar
con ejecución real (no solo lectura de código) que no hay errores, corregir
lo que se encontró roto, y subir a GitHub.

## Método

Para cada módulo (A-D): lectura del código real, luego verificación con
`npm run typecheck`, `npx vitest run` y, cuando hacía falta, casos de
prueba nuevos escritos para esta auditoría (los módulos A-D no traían
tests automatizados propios en el paquete entregado, más allá de lo que
ya cubría la suite general del proyecto).

## Módulo A — Hiperbólicas inversas recíprocas

Correcto. `rewriteReciprocalFunctions` (`src/engine/parsing/index.ts`)
reescribe `asech→acosh(1/x)`, `acsch→asinh(1/x)`, `acoth→atanh(1/x)`, con
el orden correcto para evitar la colisión de substring (`asech` contiene
`sech`) — mismo patrón que el fix histórico de `arcsec/arccsc/arccot`.
Verificado con el pipeline real de evaluación (`compute.worker.ts`, que
aplica el fallback numérico de `numericFallback.ts` cuando Algebrite deja
`asinh/acosh/atanh` sin evaluar) — llamar a `algebriteClient.evaluate()`
solo, sin ese fallback, da un falso negativo (no dispara el fallback).
Paridad numérica verificada contra el backend de `precision-lab`: mismos
inputs, mismo resultado hasta ~15 cifras.

Tests nuevos: `tests/reciprocalHyperbolicInverses.test.ts` (3 casos).

## Módulo B — Sistema de ecuaciones lineales 5×5

Correcto. `gaussJordan` (`src/engine/matrixOps.ts`) es genérico en N, sin
tope programado (confirmado leyendo el algoritmo, no solo el docstring —
que sigue diciendo "2-4", desactualizado, cosmético). `LinearSystemsMode.tsx`
(el modo con el tope viejo de 4) no está en `VISIBLE_MODES` de `App.tsx`,
confirmado inalcanzable desde la navegación. El tope real de 5 vive del
lado del cliente en `BasicScientificMode.tsx` (`Math.min(5, Math.max(2, ...))`).

No había ningún test 5×5 en el paquete entregado. Tests nuevos:
`tests/linearSystem5x5.test.ts` — único, compatible indeterminado (fila
dependiente) e incompatible (fila contradictoria), los 3 distinguidos
explícitamente vía `gaussJordan(...).kind`.

## Módulo C — Sistema de inecuaciones lineales

Implementado con diseño: exactamente 2 variables (3+ se rechaza
explícitamente), representación por vértices del polígono factible,
steps en dos niveles. El propio código (`linearInequalitySystem.ts`)
declara que este diseño fue "confirmado explícitamente por el usuario
antes de escribir este archivo" — **no hay forma de verificar esa
confirmación de manera independiente desde el código**; queda anotado
aquí para que Carlos lo confirme si hace falta.

**Bug real encontrado y corregido:** el diseño original
(`computeVertices` + `isBounded`) no distinguía una región **vacía**
(dos rectas paralelas sin intersección factible, ej. `x≥5, x≤1`) de una
región **no acotada** (una franja infinita, ej. `x≥0, x≤1`) — ambos casos
dan 0 vértices, y `isBounded()` solo evaluaba el cono de recesión (versión
homogénea, sin el término independiente de cada restricción), nunca si el
sistema original tenía algún punto factible real. Encontrado probando
manualmente ese par de casos con la misma estructura (2 rectas paralelas)
pero factibilidad distinta.

Corregido reemplazando el par `computeVertices`/`isBounded` por un
recorte de semiplanos (Sutherland-Hodgman) contra una caja grande
(`feasibleRegion()`), que da la factibilidad real en un solo paso: si el
polígono resultante queda vacío → `empty`; si toca el borde de la caja →
`unbounded` (reportando solo los vértices finitos); si no → `bounded`.
Mismo fix aplicado en paralelo al backend de `precision-lab`
(`linear_inequality_system.py`) para mantener paridad.

Tests nuevos: `tests/linearInequalitySystem.test.ts` (5 casos, incluidos
los 2 que expusieron el bug).

## Módulo D — Notación de grados D°M′S″

Correcto. Nivel 1 (`°` suelto) y Nivel 2 (`D°M′S″` compuesto) implementados
en `normalize.ts`. Verificado de punta a punta (parseo + evaluación real):
`90° = π/2 rad`, `45°30′ = 45.5°` en radianes, `45°30′15″` con segundos —
los 3 casos correctos contra valores conocidos.

Tests nuevos: `tests/degreesNotation.test.ts` (3 casos).

## Estado final verificado

`npm run typecheck`: limpio. `npx vitest run`: 158/158 (144 de la suite
original + 14 nuevos de esta auditoría). `npm run build`: limpio (mismo
warning preexistente de tamaño de chunk, no es error).

## Pendiente para una sesión futura

- Confirmar con Carlos que el diseño del Módulo C (vértices, 2 variables)
  fue efectivamente aprobado antes de escribirse, como afirma el propio
  código.
- El docstring de `linearSystem.ts` sigue diciendo "2-4 ecuaciones" —
  cosmético, no afecta el comportamiento (el código no tiene ese límite),
  pero vale actualizarlo en algún momento para que no confunda a la
  próxima sesión.

## Módulo de cierre — honestidad visual (previo a EDO/complejos/tooltips, rediseño visual, graficación/matrices/estadística/unidades)

Módulo pequeño, propuesto por otra sesión de IA y auditado contra el código real antes de ejecutarlo. Objetivo: dejar el código consistente con lo que las tres tandas de prompts nuevas ya asumen como cierto, sin adelantar ninguna fase de ellas.

Verificado antes de tocar nada: el renderizador genérico de `CATEGORY_MENUS` (bloque que mapea `group.keys`) no tenía ningún condicional sobre `k.unavailable` — confirmado leyendo el JSX real, tanto en este repo como en `precision-lab`. El límite real de 2 variables en `linearInequalitySystem.ts` también se confirmó leyendo el código (mensaje de rechazo explícito ya existente), no se asumió del spec.

Tarea 1 — estilo visual para `k.unavailable`: agregado el condicional, reutilizando el patrón exacto que ya usaba `KeyboardBasicPanel.tsx` para `°` antes del Módulo D (gris, borde punteado). Sin estilo nuevo.

Tarea 2 — honestidad de alcance en "Sist. inecuaciones": etiqueta "2 var." dentro del botón + texto del `aria-label` ampliado para que la limitación llegue también a lectores de pantalla. No se tocó el campo `ariaLabel` de `KeyDef` ni se agregó `description` — eso se dejó explícitamente para la Fase H de `spec_edo_complejos_tooltips.md`, todavía sin confirmar (sección 5.2).

Tarea 3 — corrección de documentación: nota agregada en `spec_motor_matematico_pendiente.md` (secciones 4 y 8) y en `precision-lab-rediseno-teclado-log.md` (sección 6) aclarando que el motor de inecuaciones ya existe y su alcance real es 2 variables — esos documentos viven fuera de este repo (los mantiene Carlos aparte), así que no se subieron aquí, se entregaron actualizados directamente.

Verificación explícita pedida por el propio módulo: `CATEGORIES_BASIC_MODE` y `CATEGORIES_FULL` quedaron byte-idénticos al estado anterior (comparado el archivo completo, no solo el fragmento tocado) — necesario porque `spec_edo_complejos_tooltips.md` Fase G reordena ese mismo array partiendo de su estado actual.

Paridad Lite/`precision-lab` confirmada — mismo cambio aplicado en `NaturalMathKeyboard.tsx`, mismo texto de aria-label, misma clase condicional.

Nivel de evidencia: NIVEL 1 (ejecución real). `npm run typecheck` limpio, `npx vitest run` 174/174 (sin tests nuevos — este módulo es solo JSX/estilo, no motor), `npm run build` limpio (mismo warning preexistente de tamaño de chunk).

Decisión DEDUCIBLE tomada: el texto exacto de la etiqueta ("2 var.") y su posición (esquina inferior derecha del botón, `absolute -bottom-1 right-1`) se decidieron sin pedir confirmación previa por ser un detalle menor de layout — reversible con un cambio de una línea si Carlos prefiere otra redacción o posición.

Riesgo pendiente, sin resolver en este módulo: la etiqueta "2 var." es CSS puro (`absolute`, sin overflow controlado) — no se verificó visualmente en un viewport real (sin captura de pantalla ni Chromium en esta sesión), solo que compila y no rompe tests. Vale una revisión visual rápida antes de darlo por definitivo.

# Corrección de producto posterior a Track D — M1–M15

Se aplican los fixes derivados de los módulos que quedaron rojos en Lite, manteniendo intactos los módulos ya verdes.

## Correcciones

1. `NaturalInput.tsx`: `aria-label="Entrada matemática"` por defecto, configurable vía prop.
2. `ResultPanel.tsx`: región `role="status"`, `aria-live="polite"`, `aria-atomic="true"` en todas las disposiciones.
3. Productoria Π: tecla habilitada, normalización `\prod` → `product(...)` y evaluación finita exacta en worker con límites enteros/tope 10 000.
4. `GraphViewer.tsx`: el path SVG se segmenta con nuevos comandos `M` cuando existe un hueco real de muestreo o un salto de signo con magnitud asintótica; evita conectar ramas de `1/(x-2)`/`tan(x)`.
5. Evaluación científica: polos exactos de `tan` y de `sec=1/cos` devuelven `DOMAIN_ERROR` en vez de un flotante enorme.

## Verificación

Además de los centinelas QA M9/M10/M12, se añadió `tests/trackDRegressions.test.ts` para comprobar la normalización de `\prod` y la segmentación SVG de discontinuidades. Durante la revisión del fix se detectó y corrigió un hueco adicional: `product` debía registrarse con aridad 4 en `src/engine/parsing/constants.ts`; sin esa entrada, el parser podía degradar la llamada agregada mediante multiplicación implícita.

La compilación y Vitest completos se ejecutan en GitHub Actions porque este entorno local no pudo completar `npm ci` por falta de acceso al registro npm.

