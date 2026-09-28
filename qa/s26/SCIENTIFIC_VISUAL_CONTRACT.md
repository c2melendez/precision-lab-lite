# S26 B7 — Contrato visual definitivo del módulo Científica

Estado: **ACTIVO — autoridad visual específica de B7**  
Fecha de incorporación: **2026-09-27**  
Origen: referencia visual aportada por el usuario durante B7.

## 1. Alcance y prioridad

Este documento define la composición visual objetivo de **Científica** para Precision Lab Lite y Precision Lab Plus.

Orden de autoridad dentro de B7:
1. decisiones explícitas más recientes del usuario;
2. este contrato;
3. `VISUAL_REFERENCE_CHECKLIST.md`;
4. `RESULT_FORMATS.md`, `KEYBOARD_CONTRACT.md` y demás contratos funcionales;
5. implementación actual, solo para conservar funciones existentes.

La referencia aportada es autoridad de **jerarquía, composición, densidad, agrupación y comportamiento visible**. No es autoridad matemática ni autoriza a copiar resultados ilustrativos incorrectos.

## 2. Jerarquía obligatoria

La Científica debe comunicar este orden visual:

1. **Entrada protagonista**.
2. **Resultado destacado**.
3. **Pasos de la solución** cuando existan.
4. **Vista previa / área de Gráfica** integrada al flujo principal.
5. **Acciones rápidas**.
6. Historial y superficies auxiliares subordinadas.

No deben existir grandes vacíos que separen artificialmente Entrada, Resultado, Pasos y Gráfica.

## 3. Composición Desktop / Laptop

En ancho suficiente, la referencia principal es una composición de dos áreas:

### Columna principal
- encabezado del módulo;
- control angular accesible;
- deshacer/rehacer cuando exista soporte real;
- Entrada de expresión;
- acción primaria de cálculo;
- Resultado;
- acción de copiar resultado cuando exista;
- representaciones/formato del resultado;
- Pasos de la solución, numerados y legibles.

### Columna de Gráfica
- título **Vista previa de gráfica** o equivalente;
- selector de tipo de gráfica cuando exista soporte real;
- visor/gráfica o placeholder funcional;
- controles de zoom/vista cuando estén conectados;
- lista/leyenda de expresiones cuando corresponda;
- acciones rápidas asociadas.

La vista previa de gráfica debe sentirse parte de Científica y no como una pantalla ajena.

## 4. Entrada

La Entrada debe ser el elemento más protagonista del módulo.

Debe:
- ocupar un ancho cómodo;
- usar notación matemática natural;
- mantener el selector RAD/GRAD visible sin dominar;
- conservar acceso al teclado global;
- evitar múltiples acciones primarias compitiendo entre sí.

### Acción de ejecución

La referencia visual muestra un botón `=`, pero el contrato funcional vigente tiene prioridad:

- `=` **inserta igualdad**;
- **Enter / Calcular / acción equivalente** ejecuta.

Por tanto, la implementación puede conservar la posición y peso visual del botón principal de la referencia, pero **no debe convertir `=` en ejecutar**.

## 5. Resultado

Resultado debe presentarse en una tarjeta propia y de alta jerarquía.

Debe contemplar, cuando aplique:
- resultado principal;
- representación exacta;
- aproximación decimal;
- formatos disponibles;
- copiar resultado;
- grados decimales / DMS cuando corresponda;
- ausencia de formatos irrelevantes según el tipo de resultado.

Lite y Plus deben compartir jerarquía visual aunque sus motores tengan capacidades distintas.

## 6. Pasos de la solución

Los pasos deben:
- vivir debajo del Resultado en el flujo principal;
- usar numeración o secuencia visual clara;
- mostrar matemática natural;
- evitar bloques de texto densos;
- conservar el nivel real de detalle soportado por cada motor.

**Plus** puede mostrar desarrollo más rico.  
**Lite** debe mostrar solo pasos realmente disponibles; no inventar explicaciones para igualar Plus.

## 7. Vista previa de gráfica

La Científica debe reservar un área de gráfica integrada.

Estados válidos:
- vacío/placeholder;
- expresión lista para graficar;
- vista previa real cuando exista soporte;
- error controlado.

Elementos deseables si están funcionalmente soportados:
- selector Cartesiana / modo aplicable;
- zoom `−` / `+`;
- leyenda de expresiones;
- activación/desactivación de curvas.

No se deben mostrar controles decorativos que no estén conectados.

En Tablet/Mobile esta columna debe apilarse debajo de Entrada/Resultado/Pasos sin provocar overflow horizontal.

## 8. Acciones rápidas

La referencia incorpora una zona de **Acciones rápidas**.

Acciones objetivo, siempre condicionadas a soporte real:
- **Graficar**;
- **Exacto**;
- **Aprox.**

Estas acciones deben ser secundarias respecto a la ejecución principal, pero visibles y fáciles de localizar.

Si Exacto/Aprox. ya están representados por el selector de formato, no se deben duplicar de forma confusa; puede reutilizarse la misma política de formato.

## 9. Control angular

El modo angular debe permanecer accesible y visible:
- **RAD**;
- **GRAD**.

La etiqueta visible debe seguir el contrato del producto y no introducir una tercera nomenclatura incompatible.

Debe ocupar poco espacio y mantener contraste suficiente.

## 10. Ejemplos y Opciones avanzadas en Plus

`Ejemplos` y `Opciones avanzadas (sustituciones)` se conservan, pero son superficies secundarias.

Reglas:
- no deben preceder Entrada/Resultado/Pasos/Gráfica;
- no deben comprimir el área principal;
- Opciones avanzadas permanece colapsada por defecto;
- Ejemplos debe ser compacto;
- no deben alterar el alto del teclado global.

## 11. Responsive

Viewports oficiales:
- Desktop 1440×900;
- Laptop 1280×800;
- Tablet 768×1024;
- Mobile 390×844.

### Desktop/Laptop
Priorizar dos zonas: cálculo principal + gráfica integrada.

### Tablet
Apilar preservando:
Entrada → Resultado → Pasos → Gráfica → acciones secundarias.

### Mobile
Una sola columna, sin overflow horizontal.  
Resultado y acción primaria deben quedar accesibles antes que superficies auxiliares.

## 12. Paridad Lite / Plus

Se exige paridad en:
- jerarquía;
- tarjetas;
- espaciado;
- orden;
- tratamiento de Resultado;
- lugar de Gráfica;
- control angular;
- acciones rápidas cuando existan en ambos.

Se permiten diferencias por capacidad real:
- detalle de Pasos;
- backend/formatos exclusivos;
- sustituciones de Plus;
- análisis o vista previa gráfica más rica si solo un motor la soporta.

No se eliminarán funciones exclusivas para forzar simetría.

## 13. Integridad matemática de la referencia

La captura aportada usa como ejemplo:

`sin(π/4) + √2`

Visualmente muestra un resultado que no es consistente con sus propios pasos.

El valor matemático correcto es:

`sin(π/4) + √2 = √2/2 + √2 = 3√2/2 ≈ 2.1213203436`.

Por tanto:
- la composición de la referencia sí es autoridad visual;
- sus números ilustrativos **no** deben copiarse al producto ni a pruebas.

## 14. Criterio de aceptación B7

B7 Científica solo puede cerrarse cuando:
1. los cuatro viewports no presentan overflow;
2. Entrada, Resultado, Pasos y Gráfica respetan la jerarquía;
3. estados vacío, resultado y error están cubiertos;
4. acciones rápidas no duplican/confunden funciones existentes;
5. Plus mantiene Ejemplos/Opciones avanzadas subordinados;
6. Lite/Plus conservan paridad visual razonable;
7. gates automáticos aplicables están verdes;
8. revisión humana final confirma el Preview.
