# S26.2 — Contrato de Gráficas, 3D y revolución

## Modos existentes a preservar

El módulo Gráficas debe conservar:
1. Cartesiano
2. Polar
3. Paramétrico
4. 3D

## Análisis gráfico obligatorio

Cuando matemáticamente aplique, además de la representación visual se debe mostrar el correlativo numérico/simbólico de:
- dominio;
- rango;
- interceptos en x;
- intercepto(s) en y;
- máximos globales;
- mínimos globales;
- máximos relativos;
- mínimos relativos;
- intervalos crecientes;
- intervalos decrecientes;
- vértices;
- asíntotas;
- puntos de inflexión cuando estén soportados;
- otra información ya disponible en el motor actual.

La gráfica puede marcar estos elementos, pero **la tabla de análisis es obligatoria**: no depender solo de puntos coloreados.

## Formato de valores del análisis

- `1` debe mostrarse como `1`, no como `1.000`.
- recortar ceros finales innecesarios;
- si existe valor exacto en fracción/radical, preservarlo;
- opcionalmente acompañarlo de aproximación corta.
- ejemplo conceptual: `√2/3 ≈ 0.4714`.

## Tabla de valores

Mantener/añadir una tabla de valores para la función seleccionada cuando aplique.

## 3D — alcance

El submodo 3D debe contemplar:
- superficies;
- curvas 3D cuando aplique;
- regiones/intersecciones;
- sólidos;
- sólidos de revolución;
- superficies de revolución.

## Sólidos de revolución — volumen

Entrada posible:
- función/región + límites + eje;
- o integral correspondiente cuando sea reconocible.

Métodos:
- discos;
- arandelas;
- capas cilíndricas/shells;
- cualquier variante matemática adicional que el motor implemente correctamente.

Ejes:
- eje x;
- eje y;
- recta `x=c`;
- recta `y=c` cuando la formulación lo permita.

Salida:
- región generatriz 2D;
- visualización 3D;
- método interpretado;
- integral;
- pasos;
- volumen exacto;
- aproximación;
- unidades cúbicas cuando se definan.

## Superficies de revolución — área

Tratarla como operación distinta del volumen.

Entradas:
- `y=f(x)`;
- `x=g(y)`;
- curva paramétrica cuando se soporte;
- eje de rotación;
- intervalo.

Salida:
- curva generatriz;
- superficie 3D;
- integral de área;
- pasos;
- resultado exacto/aproximado;
- unidades cuadradas.

## Detección automática

Puede existir modo `Automático` que interprete la integral ingresada y proponga:
- discos;
- arandelas;
- capas;
- superficie de revolución.

La UI debe mostrar la interpretación antes de ejecutar o hacerla explícita en el resultado.
