# S26.2 — Contrato de formatos de resultado

## Principio

El rediseño no reduce las representaciones numéricas que ya soportan los motores. El usuario puede cambiar de presentación sin alterar el valor matemático.

## Formatos

Mantener cuando apliquen:
- decimal (`dec`);
- fracción (`frac`);
- notación científica (`scn`);
- radical/exacto (`sqrt` o etiqueta equivalente existente);
- fracción mixta (`mixta`);
- grados-minutos-segundos (`dms`).

## Fracciones

Si el resultado racional es una fracción impropia:
- conservar la fracción impropia exacta;
- permitir alternar a fracción mixta;
- no convertir a decimal como sustituto de la representación exacta.

Ejemplo conceptual: `7/4 ↔ 1 3/4`.

## DMS

La conversión a DMS exige simbología correcta.

Entrada decimal con grados:
- ejemplo: `30.525°`.

Salida:
- ejemplo: `30° 31′ 30.0″`.

Debe usar:
- grados `°`;
- minutos `′`;
- segundos `″`.

No representar minutos/segundos con comas genéricas.

## Presentación numérica limpia

Regla general para resultados y análisis:
- enteros se muestran como enteros (`2`, no `2.000000`);
- decimales finitos se muestran sin ceros finales innecesarios;
- aproximaciones usan una precisión razonable y estable;
- si existe una forma exacta útil, mostrarla junto a la aproximación cuando corresponda;
- radicales/fracciones exactas no se sustituyen por decimales largos.

## Alcance

Se aplica a cualquier módulo que produzca resultados numéricos:
- Científica
- Matrices
- Gráficas
- Estadística
- Geometría
- Unidades

Cada formato aparece solo cuando sea matemáticamente aplicable.

## S26.3 — Salidas angulares de trigonometría inversa

Regla de producto:
- En modo RAD, las funciones inversas `asin/acos/atan` y las inversas recíprocas `asec/acsc/acot` (con los alias equivalentes soportados por cada motor) devuelven radianes.
- En modo DEG/GRAD, devuelven grados sexagesimales.
- Las funciones directas siguen interpretando sus argumentos conforme al modo angular.
- Una salida angular en grados habilita el formato DMS aun cuando la entrada no contenga el símbolo `°`.
- DMS usa `°`, `′`, `″` y no comillas/comas genéricas.

Ejemplos contractuales:
- RAD: `asin(0.5) = π/6 ≈ 0.523599`.
- DEG: `asin(0.5) = 30°`.
- DEG + DMS: `30° 0′ 0.0″`.
- DEG: `acos(0) = 90°`.
- DEG: `atan(1) = 45°`.
- DEG: `asec(2) = 60°`, `acsc(2) = 30°`, `acot(1) = 45°`.

Este cambio amplía explícitamente el contrato matemático anterior y por ello autoriza cambios acotados en las rutas protegidas, siempre acompañados de regresiones automáticas.


## S26.3R — Regla angular DD/DMS exclusiva

Cuando el resultado represente una magnitud angular en grados, el selector deja de tratarlo como un número genérico.

Debe ofrecer exclusivamente:
- **DD** (`dd`): grados decimales con `°`;
- **DMS** (`dms`): `°`, `′`, `″`.

No deben mostrarse en ese contexto:
- Exacto;
- Decimal;
- Fracción;
- Científica.

Ejemplos:
- `56.55° → DD: 56.55°`
- `56.55° → DMS: 56° 33′ 0.0″`
- DEG: `asin(0.5) → DD: 30°`
- DEG: `asin(0.5) → DMS: 30° 0′ 0.0″`

En RAD esta regla no se activa.

Paridad obligatoria:
- Lite y Plus exponen el mismo conjunto DD/DMS;
- ambos usan la misma simbología;
- representaciones internas/radianes convertidos/fallbacks no compiten visualmente con DD/DMS.
