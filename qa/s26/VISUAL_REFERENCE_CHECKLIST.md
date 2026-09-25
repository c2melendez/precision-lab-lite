# S26 — Checklist de referencia visual histórica

Estado: **ACTIVO como referencia de aceptación visual**.

Este documento consolida los patrones repetidos en las capturas históricas S26.2 aportadas durante la revisión humana del Preview. Las capturas son referencia de **composición visual, jerarquía, navegación, densidad y comportamiento de UI**. No sustituyen los contratos matemáticos ni autorizan a copiar resultados numéricos incorrectos presentes en un mockup.

## 1. Sistema común

- El nombre **Precision Lab Lite** o **Precision Lab Plus** y su icono deben permanecer visibles en todos los módulos.
- Lite y Plus comparten familia visual, pero mantienen identidad diferenciada.
- Navegación principal vigente: **Científica → Matrices → Gráficas → Estadística → Geometría → Unidades**.
- Header, navegación, cards, botones, estados vacíos, paneles y espaciado deben sentirse parte del mismo sistema.
- El rediseño no debe eliminar funciones existentes para simplificar la interfaz.

## 2. Breakpoints y layouts

Referencias de revisión:
- Desktop objetivo: 1440×900.
- Laptop objetivo: 1280×800.
- Tablet objetivo: 768×1024.
- Móvil objetivo: 390×844.

Se conservan los seis layouts aprobados:
- Fusionada / default.
- Separada.
- Pantalla dividida.
- Enfoque.
- Apilada.
- Flotante (solo donde el ancho permita una experiencia segura; degrada en pantallas menores).

En Desktop, cuando Entrada y Resultado convivan en columnas, **Entrada debe recibir más anchura que Resultado** (~58/42 o 60/40 cuando aplique).

## 3. Teclado virtual global

- Debe existir **un solo teclado global**; no se permiten teclados específicos duplicados dentro de módulos.
- Disponible desde Científica, Matrices, Gráficas, Estadística, Geometría y Unidades.
- Inicia colapsado.
- Categorías conservadas: **Básico, Símbolos, Álgebra, Trigonométricas, Cálculo, Complejos**.
- Las pestañas permanecen visibles durante el scroll interno del teclado.
- En Desktop el panel expandido no debe dominar la pantalla; objetivo máximo ~45% del viewport.
- Todas las teclas deben conservar tooltip contextual.
- Contrato semántico: **= inserta igualdad; Enter ejecuta**.
- Grados usa **°**; prima usa **′**.
- Variables y constantes tienen diferenciación visual.
- Básico conserva ANS, DEL, DMS, prima, <, >, =, ≤, ≥, Enter y operadores acordados.
- Álgebra debe reflejar las funciones aprobadas y no mostrar funciones inexistentes.
- Cálculo debe separar visualmente límite general, infinito, lateral izquierdo y lateral derecho cuando el motor correspondiente esté soportado.

## 4. Resultados y formatos

Todo módulo que produzca un resultado numérico debe usar una jerarquía alta y consistente.

Formatos preservados cuando apliquen:
- decimal (`dec`)
- fracción (`frac`)
- fracción mixta
- científico (`scn`)
- exacto/radical (`sqrt`)
- grados-minutos-segundos (`dms`)

Reglas:
- los toggles de formato no se eliminan por razones visuales;
- fracción impropia y mixta deben poder alternarse cuando corresponda;
- DMS usa notación correcta de grados, minutos y segundos;
- Lite y Plus deben verse coherentes aunque Plus tenga pasos más ricos;
- no se fabrican representaciones que el motor no pueda justificar.

## 5. Científica

Objetivo de jerarquía:
1. Entrada activa.
2. Resultado destacado.
3. Pasos / desarrollo cuando existan.
4. Gráfica o acción de graficar.
5. Historial de sesión subordinado, nunca compitiendo con Entrada/Resultado.

- Evitar grandes zonas vacías.
- El selector RAD/GRAD debe ser visible sin dominar el layout.
- Resultado y formatos deben ser fáciles de localizar.
- En Plus, pasos detallados conservan su ventaja funcional.

## 6. Matrices

- Entrada de matrices claramente separada del Resultado.
- Dimensiones visibles y controles compactos.
- Matrices grandes deben desplazarse dentro de su tarjeta, no provocar overflow de toda la página.
- Operaciones frecuentes visibles y legibles.
- Lite conserva banco A–F y expresión matricial.
- Plus conserva sus operaciones/backend existentes.
- No armonizar eliminando funciones exclusivas de Lite o inventando soporte inexistente en Plus.

## 7. Gráficas

- Shell compartido entre Cartesiana/2D, Polar, Paramétrica y 3D.
- Rail de expresiones/controles + lienzo/vista principal + análisis.
- Análisis visible donde exista soporte: interceptos, extremos, crecimiento/decrecimiento, vértices, asíntotas, dominio/rango u otros datos realmente calculados.
- No usar un teclado inline separado; usa el teclado global.
- Mantener controles de vista/zoom y acciones útiles.
- Para 3D y revolución, priorizar Entrada + Visualización + Resultado/Pasos sin falsificar resultados.

## 8. Estadística

Objetivo visual:
- pestañas internas claras;
- área de entrada/acciones;
- Resultado separado y destacado;
- KPIs o tarjetas de resumen cuando los datos reales del motor permitan mostrarlos;
- gráficos estadísticos solo cuando exista implementación funcional real.

No convertir un mockup en promesa de histogramas u otros gráficos si aún no están implementados.

## 9. Unidades

Objetivo visual:
- categorías fáciles de seleccionar;
- De / A claramente enfrentados;
- valor de entrada protagonista;
- Resultado grande y separado;
- conversiones comunes/atajos solo si se soportan realmente;
- mismo lenguaje de cards y espaciado del resto de módulos.

## 10. Geometría

La dirección visual histórica es ambiciosa: herramientas de construcción, propiedades, lienzo, resultado, pasos, fórmulas, ejemplos y problemas predefinidos.

La implementación se realiza por etapas:
- Figuras básicas.
- Triángulos.
- Círculos.
- Áreas compuestas.
- Sólidos.
- Constructor.

Mientras una sección no esté implementada funcionalmente debe marcarse como pendiente y **no** contarse como aceptación visual final.

Constructor objetivo cuando corresponda:
- seleccionar;
- punto;
- línea;
- segmento;
- recta/rayo;
- polígono;
- círculo;
- arco;
- elipse;
- rectángulo;
- texto;
- medida;
- deshacer/rehacer;
- limpiar;
- cuadrícula;
- selección de región objetivo/sombreada.

## 11. Historial y Ajustes

- Historial con búsqueda y acciones legibles.
- Ajustes con Apariencia, Teclado, Unidades, Precisión y opciones avanzadas según soporte existente.
- Selector de layout debe representar los seis modos vigentes.
- No introducir controles que no estén conectados a comportamiento real.

## 12. Identidad PWA

- Lite y Plus deben usar iconos de una misma familia visual con diferencia clara entre variantes.
- El icono del header y el PWA deben ser coherentes.
- Reemplazar assets solo cuando exista el recurso final aprobado; no simular una sustitución cambiando únicamente rutas.

## 13. Regla de seguridad matemática de los mockups

Los mockups pueden contener números ilustrativos incorrectos. La UI nunca debe adoptar esos valores por parecerse visualmente a una captura.

Ejemplos históricos que NO son verdad matemática:
- cuadrado de lado 4 con dos semicírculos de radio 2: área sombreada correcta = **16 − 4π = 4(4 − π) ≈ 3.4336**, no `4 − π ≈ 0.8584`;
- revolución de `y = √x`, `0 ≤ x ≤ 4`, alrededor del eje x: volumen correcto = **8π ≈ 25.1327**, no `8π/3`.

Los contratos matemáticos y las suites de regresión tienen prioridad sobre cualquier número mostrado en una referencia visual.

## 14. Criterio de aceptación del Preview

Un bloque no se considera visualmente cerrado solo porque CI esté verde.

Para cerrar visualmente debe:
1. pasar gates automáticos aplicables;
2. respetar este checklist y los contratos específicos;
3. estar desplegado en Preview;
4. pasar revisión humana sin discrepancias mayores;
5. conservar funcionalidad previa y matemáticas certificadas.
