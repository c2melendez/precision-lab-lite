# S26 — Brief obligatorio para regenerar los mockups definitivos

## Regla de arranque de la próxima sesión

**NO modificar código al iniciar la nueva sesión.**

La primera tarea obligatoria del LLM es reconstruir y presentar al usuario el **contrato visual definitivo de S26** mediante mockups coherentes y consolidados. Solo después de la aprobación explícita del usuario se reanuda la implementación.

Motivo: el contrato fue evolucionando por piezas durante S26.2/S26.3 (Científica, Gráficas, Unidades, Geometría, formatos, teclado, identidad, responsive, layouts). El Preview reveló que aplicar esas decisiones de forma fragmentada produjo inconsistencias.

## Autoridad de diseño

Orden de prioridad para reconstruir los mockups:
1. decisiones explícitas más recientes del usuario;
2. `VISUAL_REFERENCE_CHECKLIST.md`;
3. contratos específicos: `KEYBOARD_CONTRACT.md`, `RESULT_FORMATS.md`, `GRAPH_3D_CONTRACT.md`, `GEOMETRY_CONTRACT.md`, `BRAND_IDENTITY.md`;
4. `DESIGN_TARGET.md` y `VISUAL_MATRIX.md`;
5. capturas históricas S26.2 aportadas por el usuario;
6. implementación actual, únicamente para preservar funciones existentes.

La implementación actual **NO es autoridad visual** cuando contradice los mockups/contratos.

## Entregable 1 — tablero maestro

Generar primero un tablero maestro que muestre, de forma consistente:
- identidad Lite y Plus;
- header;
- navegación principal;
- spacing;
- cards;
- botones;
- estados activos;
- resultado;
- pasos;
- gráfica;
- teclado;
- historial;
- ajustes;
- Desktop 1440×900 como referencia principal.

Navegación definitiva:
**Científica → Matrices → Gráficas → Estadística → Geometría → Unidades**.

## Entregable 2 — mockups definitivos por módulo

Generar mockups separados para **Lite y Plus** cuando existan diferencias funcionales/visuales reales.

### Científica
Debe mostrar:
- Entrada protagonista;
- Resultado;
- formatos;
- Pasos (Plus más ricos; Lite según soporte real);
- acción/área de Gráfica;
- RAD/GRAD;
- historial subordinado;
- estado con resultado;
- estado vacío.

### Matrices
Debe mostrar:
- dimensiones;
- entrada de matrices;
- operaciones;
- Resultado;
- formato;
- matrices grandes sin overflow global;
- Lite conserva banco A–F y expresión matricial;
- Plus conserva sus operaciones reales.

### Gráficas
Debe mostrar:
- Cartesiana/2D;
- Polar;
- Paramétrica;
- 3D;
- rail de expresiones/controles;
- visor;
- análisis;
- controles de zoom/vista;
- tabla/propiedades únicamente si el motor realmente las soporta;
- 3D/revolución de forma coherente con los contratos matemáticos.

### Estadística
Debe mostrar:
- pestañas Descriptiva / Combinatoria / Distribución / Correlación;
- entrada de datos;
- acciones;
- KPIs o resultados reales;
- Resultado separado;
- gráficos únicamente cuando exista implementación real.

### Geometría
Debe mostrar el destino final por etapas:
- Figuras básicas;
- Triángulos;
- Círculos;
- Áreas compuestas;
- Sólidos;
- Constructor.

El mockup puede mostrar la dirección completa del Constructor, pero debe distinguir visualmente funciones ya soportadas de funciones que todavía son roadmap.

### Unidades
Debe mostrar:
- categorías;
- De / A;
- intercambio;
- Valor;
- Resultado principal;
- conversiones comunes solo si existen realmente;
- desktop y móvil.

### Historial
Mockup definitivo con:
- búsqueda;
- lista de entradas;
- acciones;
- jerarquía consistente.

### Ajustes
Mockup definitivo con:
- Apariencia;
- Teclado;
- Unidades;
- Precisión;
- Layout;
- opciones avanzadas que estén conectadas realmente.

## Entregable 3 — teclado definitivo, obligatorio

Este punto es crítico.

El teclado que actualmente aparece en los previews deriva de la implementación anterior y **NO debe asumirse como diseño aprobado**.

La próxima sesión debe generar mockups definitivos del teclado S26 antes de volver a modificar su código.

### Estados mínimos a mostrar
1. Desktop — teclado colapsado.
2. Desktop — teclado desplegado en Básico.
3. Desktop — Símbolos.
4. Desktop — Álgebra.
5. Desktop — Trigonométricas.
6. Desktop — Cálculo.
7. Desktop — Complejos.
8. Móvil — teclado colapsado.
9. Móvil — teclado desplegado.
10. Ejemplo del mismo teclado abierto desde al menos Científica, Matrices, Gráficas, Estadística, Geometría y Unidades.

### Reglas del teclado
- un solo teclado global;
- seis categorías: Básico, Símbolos, Álgebra, Trigonométricas, Cálculo, Complejos;
- inicia colapsado;
- pestañas siempre visibles;
- Desktop máximo aproximado 45% del viewport;
- móvil como panel/bottom sheet;
- tooltips globales;
- `=` inserta, no ejecuta;
- Enter ejecuta;
- `°` correcto;
- prima `′` correcta;
- ANS, DEL, DMS, comparadores y Enter en Básico según contrato;
- variables/constantes en Símbolos;
- Álgebra debe incluir los botones aprobados cuando exista soporte funcional;
- Cálculo debe mostrar cuatro límites independientes;
- no duplicar un teclado inline dentro de Gráficas u otro módulo;
- no conservar la distribución visual del teclado legado si contradice el nuevo mockup.

## Entregable 4 — breakpoints

Para cada módulo principal, mostrar como mínimo:
- Desktop 1440×900;
- Laptop 1280×800;
- Tablet 768×1024;
- Mobile 390×844.

No es necesario generar todas las combinaciones en una sola imagen; puede usarse un tablero maestro + fichas por módulo.

## Entregable 5 — seis layouts

Reconfirmar visualmente:
- fused;
- separated;
- split;
- focus;
- stacked;
- floating.

Definir claramente cuál es default por breakpoint y cómo degrada floating bajo 1024 px.

## Regla de aprobación

Después de presentar los mockups, el LLM debe pedir una revisión al usuario y **no debe tocar código hasta recibir aprobación explícita**.

Una vez aprobados:
- actualizar contratos escritos para que reflejen exactamente los mockups finales;
- congelar una versión identificable del contrato;
- recién entonces continuar S26.3.

## Integridad matemática

Los mockups son autoridad visual, no matemática.

No copiar resultados numéricos incorrectos de capturas históricas.

Ejemplos ya identificados:
- área sombreada cuadrado lado 4 + dos semicírculos r=2: correcto `16−4π = 4(4−π) ≈ 3.4336`;
- revolución `y=√x`, `0≤x≤4` alrededor de x: volumen correcto `8π ≈ 25.1327`.
