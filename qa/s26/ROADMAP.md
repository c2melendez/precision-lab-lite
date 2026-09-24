# S26 — Hoja de ruta de rediseño visual controlado

## Propósito

S26 no será solo una regresión visual. Se tratará como un módulo de **rediseño visual controlado + certificación visual + recertificación funcional**.

Objetivos:
1. revisar y mejorar visualmente todas las áreas principales;
2. construir una matriz visual reproducible;
3. implementar cambios por bloques pequeños;
4. mantener congelada la capa matemática salvo defecto real;
5. cerrar S26 únicamente después de recertificar funcionalmente el producto.

Proyecto: **Precision Lab Lite**  
Baseline funcional previo a S26: `e175f3d98e8b2eeea130faa5287e5927666befb6`

## Alcance visual obligatorio

- Calculadora científica / entrada principal.
- Calculadora gráfica.
- Matrices.
- Estadística.
- Conversión de unidades.
- Historial.
- Configuración/personalización.
- Teclado matemático y todas sus pestañas.
- Estados de resultado, error, vacío y carga cuando apliquen.
- Desktop 1440, laptop, tablet y móvil.

## Secuencia de trabajo

### S26.0 — Baseline y congelamiento
- registrar SHA inicial;
- verificar gates previos verdes;
- capturar screenshots de referencia;
- activar política de protección del motor.

### S26.1 — Inventario y matriz visual
- inventariar vistas y estados reales;
- marcar faltantes;
- definir criterios visuales por viewport;
- no tocar código de producto todavía.

### S26.2 — Diseño objetivo
- definir jerarquía, navegación, spacing, tipografía, paneles, tablas, gráficas, drawers y teclado;
- documentar diferencias necesarias entre Lite y Plus;
- aprobar visualmente antes de implementación.

### S26.3 — Implementación por bloques
Orden sugerido:
1. shell/navegación común;
2. científica;
3. gráfica;
4. matrices;
5. estadística;
6. conversión;
7. historial/configuración;
8. teclado y responsive final.

Cada bloque debe cerrar con:
- screenshots;
- tests funcionales del área;
- Playwright;
- sin cambios injustificados en rutas protegidas.

### S26.3.5 — Preview S26
Antes de congelar los baselines visuales, desplegar una versión de preview separada de producción para revisión humana.

Objetivos:
- permitir revisar visualmente el rediseño sin afectar la versión pública estable;
- validar la dirección visual conjunta de Lite y Plus antes de S26.4;
- recoger ajustes de composición, jerarquía, responsive y consistencia entre módulos;
- mantener producción estable mientras `qa/s26-execution` continúa siendo la rama de trabajo.

Momento recomendado:
- habilitar el preview cuando Gráficas + Matrices estén rediseñadas y verdes;
- actualizar el preview conforme se cierren Estadística, Unidades, Historial/Ajustes y Teclado/responsive;
- no considerar el preview como evidencia suficiente para cerrar una celda de la matriz visual: sigue siendo obligatoria la certificación automatizada posterior.

Separación de entornos:
1. Producción estable.
2. Preview S26 para revisión visual.
3. `qa/s26-execution` para trabajo activo.

Criterio de salida:
- revisión visual humana completada;
- ajustes derivados del preview aplicados o documentados;
- preview estable en Desktop 1440, laptop, tablet y móvil;
- listo para congelar baselines en S26.4.

### S26.4 — Regresión visual automatizada
Baselines Playwright por viewport y estado.

### S26.5 — Recertificación matemática
Antes de cerrar S26:
- ejecutar CI;
- Playwright completo;
- regresiones conocidas;
- paridad teclado↔motor;
- pruebas funcionales por cada área rediseñada;
- gates adicionales aplicables al proyecto.

### S26.6 — Cierre
S26 solo se cierra si:
- matriz visual completa;
- baselines aprobados;
- cero regresiones funcionales nuevas;
- rutas matemáticas protegidas intactas o cambios explícitamente justificados;
- todos los gates de release definidos para S26 están verdes.

## Regla principal

Una captura visual nunca sustituye una prueba funcional. Toda UI matemática modificada debe tener al menos un recorrido funcional que pruebe:

**UI → estado → adapter/API/worker → motor → resultado → UI**
