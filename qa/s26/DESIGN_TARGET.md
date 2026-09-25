# S26.2 — Diseño objetivo

Proyecto: **Precision Lab Lite**  
Branch: `qa/s26-execution`  
Estado: **CONTRATO VISUAL**

## 1. Principio rector

S26.2 no cambia capacidad matemática. Reorganiza y unifica la presentación de funciones ya existentes.

Objetivos:
- una sola identidad visual para los seis modos visibles;
- jerarquía clara entre entrada, resultado, pasos/análisis y gráfica;
- teclado virtual como herramienta bajo demanda, nunca como bloque que domine la pantalla al iniciar;
- escritorio 1440 como composición rica, degradando sin pérdida funcional a laptop/tablet/móvil;
- preservar las seis disposiciones configurables sin convertirlas en seis productos visualmente distintos.

## 2. Shell global

### Header
Desktop/Laptop:
- ancho máximo alineado con el workspace;
- izquierda: marca `Precision Lab Lite`;
- derecha: Historial + Ajustes;
- altura compacta, sin competir con el contenido.

Tablet/Mobile:
- marca centrada o alineada de forma estable;
- Historial y Ajustes deben conservar targets táctiles >= 44 px;
- no crear segunda línea salvo necesidad extrema.

### Navegación de modos
Orden fijo:
1. Científica
2. Matrices
3. Gráficas
4. Estadística
5. Geometría
6. Unidades

Desktop/Laptop:
- una sola fila;
- activo mediante color + indicador inferior;
- ancho alineado al workspace.

Tablet:
- una fila si cabe; si no, desplazamiento horizontal controlado antes que wrap irregular.

Mobile:
- barra horizontal desplazable;
- no wrap a dos/tres líneas.

## 3. Workspace y grid

### Desktop 1440
Contenedor útil máximo: **1376 px**, con márgenes laterales ~32 px.

Regla general:
- modos de cálculo: grid principal de aproximadamente **58/42** o **60/40** cuando exista entrada y resultado separados;
- gráfica: panel de expresiones ~260–300 px + canvas flexible;
- tarjetas alineadas al mismo sistema de radios, bordes, padding y títulos.

### Laptop 1280
- conservar dos columnas donde aporten valor;
- reducir gap y paddings;
- evitar ventanas/tarjetas demasiado estrechas.

### Tablet 768×1024
- composición de una columna;
- resultado inmediatamente después de la entrada;
- gráfica y pasos después del resultado;
- teclado como overlay/drawer o sección inline según layout configurado.

### Mobile 390×844
- una columna;
- padding lateral 12–16 px;
- botones principales full-width cuando sea necesario;
- tablas/matrices/resultados amplios usan scroll interno, nunca scroll horizontal global.

## 4. Científica

### Composición objetivo por defecto (`fused`)
La pantalla científica debe leer visualmente como:

`Entrada activa → Resultado → acciones secundarias → gráfica/resumen`

En Desktop:
- pantalla principal amplia, no una tarjeta angosta centrada;
- expresión activa con tamaño visual dominante;
- resultado claramente separado por jerarquía tipográfica;
- DEG/GRAD discreto en la esquina de la pantalla;
- historial de sesión atenuado y limitado en altura;
- gráfica como panel secundario con llamada clara a `Graficar`.

En Mobile:
- entrada y resultado permanecen en una sola superficie compacta;
- historial de sesión no debe empujar el resultado fuera de la primera pantalla;
- acciones de copiar/formato quedan accesibles sin saturar.

### Pasos
Lite solo muestra pasos cuando existen.
- aparecen debajo del resultado;
- ancho completo dentro del panel;
- timeline vertical;
- no duplicar resultado dentro de cada paso.

## 5. Matrices

Desktop/Laptop:
- izquierda: operación + dimensiones + matriz/matrices + acción primaria;
- derecha: resultado + pasos;
- columnas aprox. 60/40;
- panel de resultado permanece visible sin quedar excesivamente angosto.

Tablet/Mobile:
- operación/dimensiones;
- matriz A;
- matriz B cuando aplique;
- acción;
- resultado;
- pasos.

Reglas:
- grid de celdas puede hacer scroll horizontal interno;
- botones de operación se presentan como segmented controls/chips coherentes;
- acción primaria visualmente única.

## 6. Gráficas

Desktop:
- columna izquierda 260–300 px para expresiones y tipo de gráfica;
- canvas ocupa el resto;
- controles de zoom/centrado agrupados sobre el canvas;
- análisis de dominio/rango/intersecciones debajo del canvas o en panel lateral secundario cuando haya espacio.

Tablet:
- expresiones arriba;
- canvas debajo;
- análisis después.

Mobile:
- selector de tipo compacto;
- lista de expresiones;
- canvas con altura mínima útil;
- controles táctiles >=44 px;
- análisis colapsable si su longitud domina la pantalla.

3D:
- misma jerarquía de panel que 2D;
- rangos x/y accesibles sin comprimir el canvas.

## 7. Estadística

El modo actual tiene varias familias funcionales. Objetivo:
- una tarjeta/shell común;
- tabs internas claras para Descriptiva / Combinatoria / Distribuciones / Correlación;
- formularios alineados a una cuadrícula consistente;
- resultado en panel visual fijo de la sección activa.

Desktop:
- formularios complejos pueden usar dos columnas internas;
- resultado no debe mezclarse con botones de operación.

Mobile:
- inputs en una columna cuando el ancho no permita dos campos cómodos;
- botones de operaciones en grid 2 columnas; 3 solo si mantienen ancho táctil adecuado.

## 8. Geometría

Geometría forma parte del alcance visual principal S26.

Desktop/Laptop:
- selector de submódulos coherente con la navegación interna del producto;
- Entrada y Resultado en dos columnas cuando haya espacio;
- vista geométrica/constructor como superficie visual propia, no placeholder permanente.

Tablet/Mobile:
- submódulos con scroll horizontal si es necesario;
- Entrada → Vista/Constructor → Resultado;
- controles táctiles adecuados.

La implementación completa de Triángulos, Círculos, Áreas compuestas, Sólidos y Constructor se desarrolla por etapas; mientras una sección no esté terminada debe identificarse explícitamente como pendiente y no contarse como aceptación visual final.

## 9. Unidades

Desktop/Laptop:
- tarjeta compacta pero no excesivamente estrecha;
- categoría arriba;
- `De` y `A` en dos columnas;
- valor debajo o alineado;
- resultado destacado como bloque final.

Tablet/Mobile:
- categoría;
- De;
- A;
- Valor;
- Resultado.

El resultado debe ser el elemento de mayor jerarquía de la tarjeta.

## 10. Historial

Desktop >=1024:
- drawer lateral persistente en su comportamiento actual;
- ancho objetivo 280–320 px;
- no reducir el workspace por debajo de un ancho útil.

Tablet/Mobile:
- overlay de pantalla completa o drawer ancho;
- backdrop;
- foco atrapado/restaurado según implementación existente;
- cerrar con Escape y botón visible.

Entradas:
- expresión;
- resumen de resultado;
- acción disponible de reutilización si existe;
- jerarquía compacta.

## 11. Ajustes

Mantener un único popover/panel de configuración.

Secciones:
1. Tema
2. Disposición
3. Densidad
4. Movimiento
5. Paleta gráfica

Desktop:
- ancho suficiente para 13 temas sin crear panel excesivamente alto; usar scroll interno.

Mobile:
- panel dentro del viewport;
- scroll interno;
- no cortar opciones por safe-area.

## 12. Teclado virtual

Restricción dura:
- **inicia colapsado en las seis disposiciones**.

Desktop:
- al expandirse, panel inferior ancho alineado al workspace;
- máximo ~45% de altura del viewport;
- pestañas: Básico, Símbolos, Álgebra, Trigonométricas, Cálculo, Complejos;
- recientes inmediatamente asociados al teclado;
- tooltips para teclas con significado no obvio.

Mobile:
- bottom sheet/panel que nunca tape permanentemente la expresión activa;
- scroll interno;
- área táctil adecuada;
- cierre evidente.

No volver a introducir teclado fijo permanente.

## 13. Seis layouts

### fused
Entrada + resultado en superficie unificada; gráfica separada.

### separated
Entrada, resultado y gráfica en tarjetas independientes.

### split
Desktop 1440: dos columnas.
Por debajo de desktop ancho: colapsa a una columna.

### focus
Sin historial de sesión dentro de la pantalla científica; resultado destacado y más espacio para gráfica; dock compacto.

### stacked
Todo en flujo vertical; teclado inline colapsable; sin dock fixed.

### floating
>=1024: gráfica y teclado pueden usar ventanas flotantes persistidas.
<1024: degrada exactamente a Focus.
Nunca permitir ventanas fuera del viewport.

Las seis variantes deben compartir tokens, radios, títulos y jerarquía; cambia la composición, no la identidad visual.

## 14. Sistema visual

- superficies principales: `paper` / `paper-soft`;
- chrome reservado para teclado o superficies de alta separación;
- `marker`: acción/estado principal;
- `graph`: acciones de gráfica/confirmación;
- `alpha`: funciones secundarias del teclado;
- un solo radio principal para cards grandes;
- sombras sutiles; evitar múltiples niveles decorativos;
- título de tarjeta con borde/acento lateral cuando haya sección explícita.

## 15. Estados

Toda superficie debe contemplar:
- vacío;
- loading cuando aplique;
- resultado;
- error;
- contenido largo;
- disabled;
- focus-visible.

No introducir placeholders falsos para estados que el motor no genera.

## 16. Accesibilidad

- contraste AA;
- focus-visible consistente;
- targets táctiles >=44 px en móvil;
- headings/landmarks coherentes;
- aria-live existente preservado;
- no depender exclusivamente del color;
- reduced-motion respetado.

## 17. Restricciones técnicas

No tocar sin defecto reproducible:
- `src/engine/**`
- `src/workers/compute.worker.ts`
- `src/hooks/useComputeWorker.ts`
- `src/modes/BasicScientific/latexToAlgebrite.ts`

La implementación S26.3 debe concentrarse en componentes/layout/tokens.

## 18. Orden de implementación S26.3

1. Shell + navegación + ancho global.
2. Científica + Screen/Result/Steps/GraphPlaceholder.
3. Matrices.
4. Gráficas.
5. Estadística.
6. Unidades.
7. Historial + Ajustes.
8. Teclado + responsive final.
9. Armonización de los seis layouts.

Cada bloque debe:
- tener diff visual acotado;
- ejecutar test funcional asociado;
- capturar baseline posterior;
- no pasar al siguiente bloque con regresiones abiertas.

## 19. Criterio de aceptación S26.2

S26.2 queda aprobado cuando este contrato:
- cubre todas las superficies visibles;
- define cuatro viewports;
- define los seis layouts;
- preserva restricciones funcionales;
- permite implementar S26.3 sin decisiones visuales críticas pendientes.
