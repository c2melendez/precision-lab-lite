# B7 — Científica: contrato funcional, visual y de paridad

**Estado:** contrato cerrado para implementación.  
**Autoridad:** este documento es la referencia B7 para Precision Lab Lite y Precision Lab Plus.  
**Regla principal:** Lite y Plus deben compartir el mismo comportamiento, jerarquía visual y criterios de aceptación, aunque la implementación interna de sus motores sea distinta.

## 1. Alcance y reglas transversales

B7 puede modificar componentes visuales o de presentación nacidos en bloques anteriores cuando sea necesario para cumplir este contrato. Todo cambio transversal debe conservar la funcionalidad ya aprobada y pasar validación de no regresión en Lite y Plus.

B6 sigue siendo la autoridad funcional del teclado. B7 solo redefine su integración visual dentro de Científica, salvo correcciones indispensables de integración.

La interfaz de Científica se organiza alrededor de cuatro paneles primarios: **Entrada, Resultado, Entradas previas y Gráfica**. El teclado queda fuera de esa cuadrícula en una zona reservada. **Pasos de solución** es secundario y se ubica debajo del área primaria.

## 2. Diseño y layouts

En desktop se eliminan configuraciones que apilen verticalmente todos los paneles y generen scroll excesivo o conflicto con el teclado.

Los presets aprobados son:

1. **Balanceada:** Gráfica amplia a la derecha; Entrada, Resultado y Entradas previas a la izquierda.
2. **Cálculo amplio:** Entrada gana espacio horizontal; Resultado/Previas y Gráfica se reparten el resto.
3. **Resultado amplio:** Resultado tiene mayor protagonismo; Gráfica permanece amplia; Entrada y Previas se ajustan.
4. **Cuadrícula 2×2:** un panel por celda.

Estos presets deben exponerse en **Configuración → Apariencia → Diseño**, persistir como preferencia del usuario y aplicarse igual en Lite y Plus.

Tablet y móvil pueden reorganizar los paneles por ancho disponible, sin copiar rígidamente el desktop. La prioridad es preservar legibilidad, jerarquía y seguridad frente al teclado.

## 3. Entrada

Lite es la referencia visual para la entrada matemática natural: tipografía grande, limpia, de alto contraste y con render matemático natural.

Se elimina el botón rectangular permanente **Calcular** de la tarjeta de Entrada. La acción principal de evaluación debe ser una única flecha circular azul, siguiendo el concepto visual ya existente en Plus.

Debe existir un único acceso compacto al teclado; no se permiten disparadores duplicados.

## 4. Resultado

Resultado adopta la lógica contextual de formatos de Plus, pero con un renderer matemático natural y consistente en ambos productos.

La jerarquía base es: operación evaluada → resultado principal. Los formatos son vistas del mismo resultado, no tarjetas independientes.

Formatos contextuales posibles: **Exacto, Decimal, Fracción, Mixta, Científica, DD, DMS** y otros únicamente cuando sean matemáticamente pertinentes.

La conversión impropia ↔ mixta es una acción secundaria dentro de Fracción, no una pestaña principal.

Si solo existe una representación significativa, no se muestran pestañas innecesarias.

Toda representación simbólica debe renderizarse como matemática. Nunca debe mostrarse al usuario sintaxis técnica como `\\pi`, barras invertidas o comandos LaTeX literales. Ejemplo: `e*pi` debe verse como una expresión matemática natural equivalente a `πe` o `eπ`, nunca como texto técnico.

La tipografía de Exacto, Decimal, Fracción, Mixta y Científica debe ser visualmente coherente; Decimal y Científica no deben degradar a una apariencia monoespaciada/técnica ajena al resto.

### Integrales

- Integral indefinida: incluye **+C** en Resultado, Copiar resultado y Copiar como LaTeX.
- Integral definida: no añade C.
- Debe existir una prueba de paridad Lite/Plus para este contrato.

### Copiado

Se conservan dos acciones minimalistas:

- **Copiar resultado:** copia la representación activa en pantalla.
- **Copiar como LaTeX:** copia el LaTeX canónico de esa misma representación.

Las acciones deben ser pequeñas, discretas y confirmar con un estado breve tipo **Copiado**, sin modales.

En resultados estructurados se copia la estructura completa: conjuntos solución, sistemas, matrices, integrales con +C, etc.

## 5. Entradas previas

Entradas previas es una lista rápida de la sesión activa/reciente; Historial sigue siendo el repositorio completo hasta que el usuario lo limpie.

Las expresiones se muestran con el mismo renderer matemático natural que Entrada, en escala más compacta. No se muestran cadenas técnicas sin renderizar.

Seleccionar una entrada previa restaura la expresión completa y estructurada en Entrada para editarla; **no ejecuta automáticamente**.

En desktop se intenta mostrar hasta cinco entradas, pero cinco es un máximo, no una obligación. Expresiones altas o complejas reducen el número visible. No se reduce la tipografía hasta volverla ilegible.

No debe haber scroll vertical ni horizontal dentro del bloque. Cuando no cabe una nueva entrada, se elimina de esta lista rápida solo la más antigua; Historial permanece intacto.

Tablet y móvil siguen el mismo principio adaptativo, sin cantidades rígidas prefijadas.

## 6. Gráfica: propósito y estados

La tarjeta Gráfica de Científica es una **vista previa**, no una réplica del módulo Gráficas. Regla conceptual: **Científica muestra; Gráficas analiza.**

La vista previa usa escala automática para mantener visible lo matemáticamente relevante y evita análisis extensos de interceptos, extremos, asíntotas, intervalos, tablas o herramientas avanzadas.

Estados semánticos de la tarjeta:

- **Gráfica disponible:** se presenta la visualización contextual.
- **Representación gráfica no necesaria:** operaciones aritméticas, constantes u otros resultados donde una gráfica no aporte significado. No se inventa, por ejemplo, `y=5` solo porque `2+3=5`.
- **No aplicable en esta vista:** el objeto no tiene una representación 2D adecuada en Científica.
- **Vista avanzada disponible:** existe representación útil, pero su análisis completo pertenece a Gráficas.

## 7. Reglas gráficas por operación

La gráfica no consume texto renderizado de la UI. Debe recibir **contexto matemático canónico/estructurado** independiente del formato visual.

- Función directa: representa la función ingresada.
- Derivada: representa `f(x)` y `f′(x)`, con énfasis en la derivada. En órdenes superiores se evita saturación y se priorizan original + resultado solicitado.
- Integral indefinida: integrando + una antiderivada representativa. Si se usa `C=0`, debe indicarse que es solo una muestra visual de la familia.
- Integral definida: función + límites + intervalo y región correspondiente. La representación debe respetar el significado firmado de la integral cuando haya zonas positivas y negativas.
- Límite bilateral: foco/zoom contextual alrededor del punto y aproximación desde ambos lados.
- Límite lateral: se enfatiza solo el lado solicitado; el otro puede quedar como contexto tenue.
- Límite infinito: se muestra la aproximación a la asíntota vertical y el comportamiento divergente.
- Límite al infinito: se prioriza el comportamiento lejano, no un punto finito.
- Simplificación/factorización: original + transformada solo si la comparación aporta información.
- Si dos formas son visualmente idénticas, se evita sobretrazar curvas redundantes y se puede mostrar una indicación de equivalencia.
- Si una simplificación cambia la semántica del dominio, se preservan exclusiones. Ejemplo: `(x²−1)/(x−1)` conserva `x≠1` aunque se simplifique a `x+1`.

## 8. Sistemas e inecuaciones

### Sistemas de ecuaciones

En dos variables se muestran las ecuaciones componentes y se resaltan sus soluciones comunes/intersecciones. Si no hay solución, se muestran las curvas sin intersección y Resultado lo indica. Si son coincidentes, se muestra una sola curva con indicación de infinitas soluciones.

Más de dos ecuaciones siguen siendo representables en 2D si todas dependen de las mismas dos variables. El criterio de límite dimensional es el número de variables graficadas, no el número de ecuaciones.

Si el sistema exige más dimensiones de las que Científica puede representar correctamente, no se fuerza una proyección engañosa y se deriva a Gráficas.

### Inecuaciones

Inecuación individual: frontera + región solución. Desigualdad estricta → frontera no incluida; inclusiva → frontera incluida.

Sistema de inecuaciones: todas las fronteras + intersección de regiones válidas. Si no existe región común, Resultado indica sin solución.

Para una sola variable puede utilizarse una representación sencilla sobre el eje real en lugar de un plano completo.

Contrato de motor/presentación: ambos productos deben converger a un **conjunto solución estructurado y canónico** para inecuaciones de una variable. Los sistemas deben conservar información explícita de frontera abierta/cerrada; la limitación actual que trata `<`/`>` como `≤`/`≥` debe corregirse antes de declarar B7 completo.

## 9. EDO y variable compleja

### EDO

Científica representa el conjunto de soluciones, no la ecuación diferencial como una curva ordinaria.

- Solución particular: se grafica esa solución.
- Familia general: se muestran algunas curvas representativas, claramente etiquetadas como muestras de la familia.
- Si se usa una única muestra con `C=0`, nunca se presenta como “la solución” general.
- Solución implícita: se representa solo si el motor puede hacerlo correctamente.
- Campos de pendientes y análisis profundo quedan en Gráficas.

### Variable compleja

La vista selecciona el sistema de representación según dominio y codominio:

- Número complejo o raíces complejas: plano de Argand.
- Función compleja de variable real: partes real e imaginaria como curvas simples.
- Función genuina de variable compleja: no se fuerza una curva real 2D; se usa una representación compacta válida o se deriva a Gráficas para visualización especializada.

## 10. Puente Científica → Gráficas

La tarjeta ofrece una acción visible **Abrir en Gráficas** / **Analizar en Gráficas**. También puede admitirse clic sobre la preview, pero debe existir una acción explícita accesible.

La navegación transfiere el **contexto matemático completo**, no solo una cadena o la curva final: expresión original, resultado transformado, límites, dirección de límite, intervalo, restricciones de dominio, ecuaciones del sistema, región de inecuaciones, parámetros y demás metadatos relevantes.

Gráficas debe abrir con ese contexto ya cargado, listo para análisis ampliado, sin obligar a reescribir la operación.

## 11. Teclado en Científica

Lite es la autoridad visual del dock.

- Anclado al borde inferior.
- Integrado al ancho útil respetando la barra lateral.
- Sin cápsula flotante, margen inferior artificial ni sombra de ventana en Plus.
- Cerrado: franja/acceso discreto.
- Abierto: se despliega desde la zona inferior.
- Nunca cubre Entrada, Resultado, Entradas previas o Gráfica; el workspace reserva su altura real.

La funcionalidad B6 (teclas, categorías, tooltips, Enter, DEL, LCM/GCD, límites, etc.) se conserva intacta.

## 12. Limpieza específica de Plus

En Científica se retiran de la vista principal:

- bloque permanente de **Ejemplos**;
- **Opciones avanzadas / Sustituciones**, salvo que una revisión funcional demuestre que todavía aporta capacidad esencial.

Si Sustituciones debe conservarse, pasa a un acceso secundario/contextual; no ocupa espacio fijo.

## 13. Pasos de solución

Pasos de solución permanece debajo del área primaria y puede crecer verticalmente con scroll sin robar espacio seguro a los cuatro paneles principales.

**Pendiente no bloqueante:** la relación exacta entre el antiguo “Resumen / procedimiento resumido” y Pasos de solución no fue cerrada durante B7. No se debe inventar una conducta nueva ni eliminar información hasta tomar una decisión específica. Este punto queda explícitamente fuera del cambio de implementación B7 inicial.

## 14. Matriz mínima de aceptación / no regresión

B7 no se considera completo hasta validar en Lite y Plus, como mínimo:

- paridad de los cuatro layouts y persistencia desde Configuración → Apariencia → Diseño;
- teclado inferior sin overlay ni pérdida de funciones B6;
- render natural de constantes (`e`, `π`), radicales, fracciones, mixta, científica, grados/DMS, complejos e integrales con `+C`;
- formatos contextuales sin pestañas irrelevantes;
- Copiar resultado y Copiar como LaTeX coherentes con la vista activa;
- reutilización estructurada de Entradas previas sin autoejecución;
- gráfica contextual de función, derivada, integral, límites, sistemas, inecuaciones, EDO y complejos;
- dominio/exclusiones preservados en transformaciones algebraicas;
- estados “no necesaria / no aplicable / vista avanzada”;
- transferencia canónica de contexto desde Científica hacia Gráficas;
- inecuaciones con conjuntos solución estructurados y fronteras estrictas/inclusivas correctas;
- responsive desktop/tablet/mobile y ausencia de solapamiento con teclado;
- no regresión de módulos que reutilicen Resultado, render matemático, layout o controles compartidos.

## 15. Orden de implementación

Para minimizar retrabajo, el orden recomendado es:

1. infraestructura compartida de Resultado + renderer matemático + modelo de resultado/contexto canónico;
2. layout B7 y presets en Configuración → Apariencia → Diseño;
3. integración visual del teclado según Lite;
4. Entradas previas;
5. preview Gráfica contextual y estados semánticos;
6. puente Científica → Gráficas;
7. correcciones de motor necesarias para paridad (especialmente conjuntos solución/fronteras de inecuaciones);
8. limpieza específica de Plus;
9. pruebas de paridad, visuales, funcionales y no regresión.

Este orden no cambia el alcance: todos los puntos anteriores forman parte del contrato B7 salvo el pendiente explícito de Resumen/Pasos.