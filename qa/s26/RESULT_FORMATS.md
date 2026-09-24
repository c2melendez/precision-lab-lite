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
