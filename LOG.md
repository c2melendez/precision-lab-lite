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
