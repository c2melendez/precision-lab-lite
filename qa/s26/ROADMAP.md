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

### S26.2R — Reconfirmación definitiva del contrato visual

**Obligatoria antes de continuar S26.3 tras la revisión humana del Preview.**

Motivo:
- el contrato S26.2 evolucionó por piezas durante varias sesiones;
- el Preview reveló inconsistencias entre módulos;
- el teclado implementado conserva una arquitectura visual anterior que no representa el mockup definitivo deseado.

Procedimiento:
1. regenerar mockups definitivos consolidados para todos los módulos;
2. incluir teclado global colapsado y desplegado;
3. incluir seis categorías del teclado;
4. incluir Desktop 1440×900 y estrategia laptop/tablet/mobile;
5. reconfirmar los seis layouts;
6. presentar al usuario;
7. **detenerse y esperar aprobación explícita**;
8. actualizar contratos escritos para que coincidan exactamente con los mockups aprobados;
9. congelar el contrato visual definitivo;
10. solo entonces reanudar S26.3.

Documento operativo:
- `qa/s26/MOCKUP_REGENERATION_BRIEF.md`
- `qa/s26/VISUAL_REFERENCE_CHECKLIST.md`

Criterio de salida:
- mockups definitivos aprobados por el usuario;
- teclado definitivo visualmente aprobado;
- contratos escritos reconciliados;
- ninguna ambigüedad entre mockup y código objetivo.

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


## Reconciliación S26.2R / S26.3R — 2026-09-25

Autoridad visual vigente: contrato final S26.2R aprobado por el usuario.

Orden operativo vigente de S26.3R:
1. Shell global + sidebar expandido/compacto — **PASS DEFINITIVO**.
2. Configuración + Apariencia + selector de layouts — **EN CURSO**.
3. Historial.
4. Capa común de Resultado y formatos.
5. Teclado global — shell, apertura/cierre y responsive.
6. Teclado global — paridad de las seis categorías.
7. Científica.
8. Matrices.
9. Estadística.
10. Unidades.
11. Gráficas 2D.
12. Gráficas 3D.
13. Geometría.
14. Armonización responsive transversal.
15. Preview S26.3.5 + revisión humana.
16. Correcciones del Preview.
17. Preparación de S26.4.

Regla: cada bloque cierra con diff acotado, gates aplicables, revisión contractual y actualización del log.


## Estado S26.3R — 2026-09-26

1. Shell + sidebar — **PASS DEFINITIVO**.
2. Configuración + Apariencia + layouts — **PASS DEFINITIVO**.
3. Historial — **PASS DEFINITIVO**.
4. Resultado + formatos — **PASS DEFINITIVO**.
5. Teclado global shell/open-close/responsive — **PASS DEFINITIVO**.
6. Paridad de seis categorías del teclado — pendiente.
7. Científica — pendiente.
8. Matrices — pendiente.
9. Estadística — pendiente.
10. Unidades — pendiente.
11. Gráficas 2D — pendiente.
12. Gráficas 3D — pendiente.
13. Geometría — pendiente.
14. Armonización responsive transversal — pendiente.
15. Preview S26.3.5 — pendiente.
16. Correcciones Preview — pendiente.
17. Preparación S26.4 — pendiente.

### Checkpoint obligatorio antes del Bloque 5

**Checkpoint de Paridad S26.3R — Bloques 1–4**

Documento:
- `qa/s26/PARITY_CHECKPOINT_B1_B4.md`

Regla:
**NO iniciar Bloque 5 hasta cerrar el checkpoint, corregir GAPs y recertificar si hubo cambios.**

HEAD de código certificado:
- Lite: `c878da8183cdab6ca791afcacee6841199a5c067`
- Plus: `40fcf3b3aa2d83fa58943fec603198dd0bb291bb`

Los commits posteriores de documentación no sustituyen esos HEAD de certificación funcional.


### Checkpoint B1–B4 cerrado — 2026-09-26

Resultado: **PASS, sin GAPs bloqueantes detectados**.

- B1: PARIDAD.
- B2: PARIDAD.
- B3: PARIDAD; cobertura incompleta de Geometría/Unidades permanece documentada como limitación compartida.
- B4: PARIDAD; DD/DMS exclusivo en grados verificado en ambos proyectos.
- Diferencias Plus/Lite ya documentadas se mantienen como intencionales.

Bloque 5 queda **desbloqueado y EN CURSO**. Su alcance es únicamente shell global, apertura/cierre y responsive. La paridad tecla por tecla de las seis categorías permanece reservada para B6.


### B6 — autoridad visual congelada

- Autoridad visual conjunta: `VISUAL_CONTRACT_FINAL_S26_2R.md` + `Mockups definitivos de Precision Lab.png`.
- Autoridad funcional/semántica: `KEYBOARD_CONTRACT.md`.
- La implementación actual no es autoridad visual.
- B6 debe cerrar con matriz tecla por tecla Lite↔Plus, gates automáticos y revisión humana de Preview.


### B6 Básico — implementación

- Inventario congelado: 31 teclas en 4 filas.
- Enter unificado visualmente en Lite/Plus.
- Tooltips reales obligatorios en todas las teclas básicas.
- Lite alineado a la gramática visual theme-aware de Plus.
- Matriz: `B6_BASIC_RECONCILIATION.md`.
- Estado: **IMPLEMENTADO — pendiente gates + Preview/revisión humana**.


## Checkpoint B6 — cierre de sesión 2026-09-27

- B1–B5: **PASS DEFINITIVO**.
- B6: **PASS AUTOMATIZADO — pendiente confirmación visual humana final**.
- HEAD certificado de código Precision Lab Lite: `cdd8e35ac6ddcb670f6dbdfe0bf79fa1fde7c9ec`.
- Arquitectura vigente: familias arriba → subcategorías → teclas contextuales → núcleo básico debajo.
- SmartDock retirado.
- Acciones rápidas de Ecuaciones restringidas a Álgebra → Ecuaciones.
- No iniciar B7 hasta confirmar visualmente la última versión.

Ver: `SESSION_CLOSURE_2026-09-27.md` y `START_HERE_2026-09-27.md`.


## Cierre B6 — 2026-09-27

Estado:
- B1 Shell/Sidebar — **PASS DEFINITIVO**.
- B2 Configuración/Apariencia/Layouts — **PASS DEFINITIVO**.
- B3 Historial/Reusar — **PASS DEFINITIVO**.
- B4 Resultado/Formatos/DD-DMS — **PASS DEFINITIVO**.
- B5 Teclado global shell/open-close/responsive — **PASS DEFINITIVO**.
- B6 Teclado interno/paridad/jerarquía — **PASS AUTOMÁTICO; pendiente confirmación visual humana final**.

HEAD certificado B6: `cdd8e35ac6ddcb670f6dbdfe0bf79fa1fde7c9ec`.

Gates:
CI, Playwright E2E, S22 PWA Offline, S23 Accessibility, S25 Security y Cross-browser smoke: PASS. S26 Preview: build-preview/composición/upload de artefacto PASS; deploy Pages FAIL.

### Próximo paso obligatorio
1. revisar B6 visualmente en Desktop, Tablet y Mobile;
2. si el usuario aprueba, marcar B6 PASS DEFINITIVO;
3. actualizar log/matriz;
4. continuar con **B7 — Científica**.

No iniciar S26.4 todavía.


## B6 — PASS DEFINITIVO — 2026-09-27

- Revisión humana final: aprobada.
- Arquitectura desktop/laptop: **familias arriba → subcategorías | básico | contexto**.
- Básico: 23 teclas, cuatro filas, paridad Lite/Plus.
- Contextuales genéricas: 3 columnas en ambos motores.
- Responsive móvil: panel a ancho completo; tablet/laptop/desktop protegidos por E2E.
- Densidad de Ecuaciones diferenciales y Complejos → Avanzado validada.
- Contraste accesible de subcategoría activa recertificado.
- HEAD certificado de código: `f029df3d58c421b478a43dac05dd48306a4687a7`.
- Gates: CI, Playwright E2E, S22 PWA Offline, S23 Accessibility, S25 Security, Cross-browser smoke y S26 Preview: PASS.

**B6 queda cerrado como PASS DEFINITIVO.**

### B7 — Científica — EN CURSO

Alcance:
- composición Entrada → Resultado → Pasos → Gráfica;
- estados vacío, resultado, carga y error;
- responsive Desktop 1440, Laptop 1280, Tablet 768 y Mobile 390;
- paridad Lite/Plus sin eliminar diferencias funcionales intencionales;
- en Plus, revisar Ejemplos y Opciones avanzadas como superficies secundarias que no deben competir con Entrada/Resultado;
- no modificar rutas matemáticas protegidas salvo defecto reproducible.
