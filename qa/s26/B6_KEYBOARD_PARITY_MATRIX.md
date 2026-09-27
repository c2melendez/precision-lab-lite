# S26 B6 — Matriz de paridad del teclado global

Fecha: 2026-09-26  
Rama: `qa/s26-execution`  
Estado: **EN CURSO — implementación estructural avanzada, pendientes de CI/Preview y GAPs funcionales explícitos**

## Regla de lectura

Estados:
- **PASS CÓDIGO**: implementado con paridad Lite↔Plus y cubierto por prueba automática, pendiente de gates/Preview cuando corresponda.
- **GAP**: falta una capacidad o una ruta real en una de las ediciones.
- **PENDIENTE GATE**: código/prueba presentes, pero los workflows siguen en cola.
- **DIFERENCIA INTENCIONAL**: diferencia de motor documentada que no cambia el significado de la tecla.

## Arquitectura global

| Contrato | Lite | Plus | Estado |
|---|---|---|---|
| Núcleo permanente | 23 teclas canónicas | 23 teclas canónicas | PASS CÓDIGO |
| `=` inserta y no ejecuta | Sí | Sí | PASS CÓDIGO |
| Enter virtual ejecuta | Sí | Sí | PASS CÓDIGO |
| Enter físico usa mismo flujo | Implementado | Implementado | PENDIENTE GATE |
| Familias contextuales | 7 | 7 | PASS CÓDIGO |
| Orden de familias | Álgebra → Trig → Cálculo → Complejos → Símbolos → Unidades → Más | Igual | PASS CÓDIGO |
| Desktop izquierda/centro/derecha | Implementado | Implementado | PENDIENTE PREVIEW |
| Tablet/Mobile conserva jerarquía | Implementado por grid responsive | Implementado por grid responsive | PENDIENTE PREVIEW |
| Seis módulos usan teclado B6 | Fallback global + Científica | Fallback global + Científica + Gráficas migrada | PENDIENTE E2E |

## Núcleo permanente

Inventario congelado:

- fila 1: `7 8 9 ( ) ⌫`
- fila 2: `4 5 6 × ÷ %`
- fila 3: `1 2 3 + − .`
- fila 4: `0 ANS DEL = Enter`

Teclas trasladadas fuera del núcleo: relaciones, `°`, prima, DMS y `±()`.

## Álgebra

| Capacidad | Lite | Plus | Estado |
|---|---|---|---|
| π/e/∞ contextuales | Sí | Sí | PASS CÓDIGO |
| Relaciones < > ≤ ≥ = | Sí | Sí | PASS CÓDIGO |
| ln/log/log₂/log_b | Sí | Sí | PASS CÓDIGO |
| x²/xⁿ/eˣ/10ˣ | Sí | Sí | PASS CÓDIGO |
| operador `^` | Sí | Sí | PENDIENTE prueba de paridad física |
| EXP ambiguo retirado de B6 | Sí | Sí | PASS CÓDIGO |
| √ / raíz n-ésima | Sí | Sí | PASS CÓDIGO |
| raíz cúbica independiente retirada de B6 | Sí | Sí | PASS CÓDIGO |
| |x| / factorial | Sí | Sí | PASS CÓDIGO |
| sgn / mod | Sí | Sí | PASS CÓDIGO |
| MCM/MCD aridad variable | Plantilla lista editable | Plantilla lista editable | PASS CÓDIGO |
| Simplificar | Ruta general existente | endpoint /simplify | PASS funcional heredado |
| Factorizar | sin ruta B6 específica verificada | endpoint /factor | **GAP Lite** |
| Expandir | primitiva interna existe, sin ruta B6 específica | endpoint /expand | **GAP Lite** |

## Trigonometría

| Capacidad | Lite | Plus | Estado |
|---|---|---|---|
| π/e/∞ contextuales | Sí | Sí | PASS CÓDIGO |
| directas y recíprocas | Sí | Sí | PASS heredado |
| inversas con notación natural | Sí | Sí | PASS heredado |
| hiperbólicas | Sí | Sí | PASS heredado |
| hiperbólicas inversas | Sí | Sí | PASS heredado |
| DEG/RAD global | Sí | Sí | PASS heredado |
| inversas DEG → resultado angular DD/DMS | Sí | Sí | ligado a B4 ya corregido |

## Cálculo

| Capacidad | Lite | Plus | Estado |
|---|---|---|---|
| π/e/∞ contextuales | Sí | Sí | PASS CÓDIGO |
| integrales | Sí | Sí | PASS heredado |
| derivadas | Sí | Sí | PASS heredado |
| Σ / Π | Sí | Sí | PASS heredado |
| límite x→a | Sí | Sí | PASS CÓDIGO |
| límite x→∞ | Sí | Sí | PASS CÓDIGO |
| límite x→a⁻ | tecla independiente | tecla independiente | PASS CÓDIGO |
| límite x→a⁺ | tecla independiente | tecla independiente | PASS CÓDIGO |
| EDO | solo variantes soportadas | solo variantes soportadas | PASS heredado sujeto a inventario final |

## Complejos

| Capacidad | Lite | Plus | Estado |
|---|---|---|---|
| i/π/e/∞ acceso directo | Sí | Sí | PASS CÓDIGO |
| Re/Im/arg/conj/|z| | Sí | Sí | PASS heredado |
| polar/exponencial/raíces | Sí | Sí | PASS heredado |
| residuos/singularidades | Sí | Sí | PASS heredado |
| graficar Argand | ruta existente | ruta existente | PASS heredado |

## Símbolos

Variables canónicas ya implementadas en ambas ediciones:
`x y z t r θ Φ a b c n`.

Funciones canónicas ya implementadas:
`f(x) g(x) h(x)`.

Constantes:
`π e i ∞ φ τ`.

Convenciones:
- `Φ` mayúscula = variable/ángulo polar.
- `φ` minúscula = número áureo.
- `τ = 2π`.

Estado: **PASS CÓDIGO**, pendiente de Preview visual para agrupación/color.

## Unidades y Más

Unidades:
- `°`, prima, DMS;
- fracción simple;
- fracción mixta;
- π.

Más:
- fracción simple/mixta;
- relaciones;
- ángulos;
- `±()` reubicada aquí para conservar funcionalidad.

Estado: **PASS CÓDIGO**.

## Disponibilidad por módulo

Módulos obligatorios:
1. Científica
2. Gráficas
3. Matrices
4. Estadística
5. Geometría
6. Unidades

Lite:
- Científica registra teclado propio B6.
- Los demás usan fallback global B6.

Plus:
- Científica registra B6.
- Gráficas fue migrada de la variante legacy a B6.
- Matrices/Estadística/Geometría/Unidades usan fallback global.

Existe E2E que exige en cada módulo:
- núcleo B6 visible;
- 7 familias;
- apertura/cierre global.

## Pendientes antes de cerrar B6

1. Esperar y revisar CI/Playwright de los heads actuales.
2. Corregir cualquier regresión de tipos/sintaxis/E2E.
3. Completar prueba de paridad para `^` físico ↔ virtual.
4. Resolver el GAP Lite de Factorizar/Expandir:
   - ampliar motor/worker de forma explícita, o
   - documentar diferencia de capacidad si se decide no añadirla.
5. Auditar la ruta legacy `frontend/src/components/MathKeyboard.tsx` de Plus, que no está montada en la navegación visible pero conserva SHIFT/ALPHA y semántica histórica de `=`.
6. Preview humana Desktop/Tablet/Mobile.
7. Solo después declarar B6 PASS definitivo.

## Heads de referencia al crear esta matriz

Los heads continuarán avanzando durante B6; usar siempre la rama como autoridad y registrar el head final al recertificar.


## Incidencia de gate Lite — 2026-09-26

Primer head evaluado: `cad73caa113c68a924d564d53ef3112623b6b27a`.

Resultado inicial:
- CI: FAIL en Typecheck.
- Preview: FAIL al compilar S26.
- Playwright: FAIL porque el webServer no pudo arrancar.
- Los gates derivados también quedaron rojos al no poder construir la rama.

Causa raíz:
`src/components/NaturalInput.tsx(82,7): TS2722: Cannot invoke an object which is possibly 'undefined'.`

Origen:
el callback opcional `onEnter` se filtraba antes de registrar el listener, pero TypeScript no conservaba ese narrowing dentro de la función anidada.

Corrección:
se captura `const enter = onEnter` dentro del efecto, se valida `!enter` y el listener invoca `enter()`.

Commit correctivo:
`eb7014eb0b1ce4c6a0a6b49866c0586d07acf70c`.

Estado posterior:
nuevo conjunto de workflows disparado; Preview en ejecución y CI/Playwright/resto de gates en cola al momento de esta actualización. B6 permanece EN CURSO hasta observar verde real.
