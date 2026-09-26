# S26 — Log de ejecución

## Sesión

Fecha: 2026-09-23  
Proyecto: **Precision Lab Lite**  
Branch: `qa/s26-execution`  
Baseline funcional protegido previo a S26: `e175f3d98e8b2eeea130faa5287e5927666befb6`  
SHA de preparación S26 integrado en main: `9d901b0db3b1b9995374757dc5213146c252278c`

## Estado del módulo

- [x] Preparación documental S26 integrada en `main`.
- [x] Política de integridad matemática definida.
- [x] Hoja de ruta y handoff definidos.
- [x] Inventario de superficies reales creado en `INVENTORY.md`.
- [x] Matriz visual ampliada a superficies, estados, layouts y personalización reales.
- [x] Suite `e2e/s26-baseline.spec.ts` añadida para baseline reproducible.
- [x] S26.0 — Baseline y congelamiento: **CERRADO**.
- [x] S26.1 — Inventario y matriz: **CERRADO**.
- [ ] S26.2 — Diseño objetivo.
- [ ] S26.3 — Implementación por bloques.
- [ ] S26.4 — Regresión visual automatizada.
- [ ] S26.5 — Recertificación matemática.
- [ ] S26.6 — Cierre.

## Decisiones vigentes

1. S26 no se limita a la pantalla científica.
2. El alcance visual primario se basa en superficies actualmente visibles, no en componentes muertos/ocultos.
3. Los modos internos deliberadamente ocultos conservan smoke funcional para detectar regresiones por componentes compartidos.
4. Se cubrirán Desktop 1440×900, Laptop 1280×800, Tablet 768×1024 y Mobile 390×844.
5. Existen seis layouts transversales: `fused`, `separated`, `split`, `focus`, `stacked`, `floating`.
6. Tema, densidad, movimiento y paleta gráfica se cubren mediante estrategia combinatoria controlada; no se multiplica cada pantalla por todas las combinaciones.
7. La capa matemática queda congelada salvo defecto reproducible y documentado.
8. Una captura visual nunca sustituye una prueba funcional.
9. Antes del cierre se ejecutará recertificación matemática completa.

## S26.0 — Baseline y congelamiento

### Completado
- Branch de ejecución creada desde el `main` posterior a la preparación S26.
- Baseline funcional previo a S26 registrado y protegido.
- Rutas matemáticas protegidas definidas en `MATHEMATICAL_INTEGRITY_POLICY.md`.
- PR S26 de ejecución abierto como draft para impedir cierre prematuro.
- Suite de baseline añadida: cinco superficies visibles × cuatro viewports.
- Captura adicional de historial, ajustes y teclado.
- Cobertura de seis layouts en Desktop/Mobile.
- Captura explícita de `floating` a 1023 px y 1024 px.

### Validación final
- CI: PASS.
- Playwright E2E: PASS.
- Cross-browser aplicable: PASS.
- Evidencia visual adjunta al reporte Playwright mediante `testInfo.attach`.

## S26.1 — Inventario y matriz

### Completado
- Inventario de navegación visible real.
- Inventario de modos internos/no visibles.
- Inventario de historial, ajustes y teclado.
- Identificación de seis layouts globales.
- Definición de cuatro viewports oficiales.
- Estrategia combinatoria para temas/densidad/movimiento/paletas.
- Matriz ampliada con estados funcionales y cobertura transversal.

### Cierre S26.1
- Baseline runtime confirmado en PASS.
- Matriz enlazada a pruebas funcionales mediante `TEST_MAPPING.md`.
- No se detectaron regresiones funcionales ni cambios en rutas matemáticas protegidas.
- Siguiente fase: S26.2 Diseño objetivo.

## Rutas protegidas tocadas

Ninguna.

## Cambios funcionales

Ninguno. S26 sigue limitado a QA/documentación; no se ha modificado producto ni motor matemático.

## Instrucción de continuidad

S26.0 y S26.1 están cerrados. Continuar con S26.2 — Diseño objetivo, sin modificar rutas matemáticas protegidas.

## S26.3 — Implementación por bloques

### Bloque 1 — Shell, identidad, navegación y teclado global — CERRADO
- Navegación final: Científica → Matrices → Gráficas → Estadística → Geometría → Unidades.
- Identidad persistente PL / PL+ integrada.
- Geometría incorporada como sexto módulo visible.
- Teclado existente reutilizado como entrada global; no se duplicó la botonería.
- Científica conserva prioridad sobre su teclado propietario.
- Accesibilidad y semántica de marca preservadas.
- Regresiones detectadas y corregidas: contraste del monograma Lite, h1 de branding Plus y selectores ambiguos de Matrices.
- Gates posteriores al bloque: PASS completos en ambos repos.

### Bloque 2 — Científica / Entrada / Resultado / Pasos / Formatos — EN CURSO
Objetivos:
- conservar dec / frac / scn / exacto-radical;
- añadir presentación mixta cuando el racional impropio lo permita;
- añadir presentación DMS cuando el valor sea angular y tenga simbología válida;
- no introducir ceros finales innecesarios;
- preservar resultados exactos y aproximados;
- armonizar Entrada / Resultado / Pasos con el contrato visual;
- no tocar motor matemático salvo defecto reproducible.

### Excepción documentada — trigonometría inversa en DEG/GRAD
Motivo: ampliación funcional explícitamente aprobada durante S26.3.

Cambio matemático:
- RAD conserva salidas de las seis trigonométricas inversas convencionales en radianes.
- DEG/GRAD devuelve en grados sexagesimales las salidas de seno/coseno/tangente inversos y secante/cosecante/cotangente inversos.
- Las salidas angulares en grados pueden alternarse a DMS.
- Las trigonométricas directas conservan su semántica de entrada por modo angular.

Rutas protegidas modificadas:
- `src/engine/parsing/index.ts`

Pruebas añadidas:
- `tests/exhaustive-module01-trigonometry.test.ts`
- `src/components/ResultPanel.test.tsx`

Criterio de aceptación:
- las seis trigonométricas inversas convencionales en DEG/GRAD devuelven grados.
- composición directa(inversa) conserva resultado correcto.
- RAD no cambia.
- UI etiqueta grados con `°` y ofrece DMS solo cuando el resultado es angular.

### Plantillas visuales DEG/GRAD
- En DEG/GRAD, el teclado inserta `°` dentro del argumento de sin/cos/tan/sec/csc/cot.
- En RAD, conserva la plantilla sin `°`.
- El placeholder permanece antes del símbolo de grado.
- Las inversas no reciben `°` en el argumento; su salida se expresa en la unidad angular activa.
- Las pruebas cubren teclado, escritura manual sin `°`, símbolo explícito `°` y ausencia de doble conversión.

### Subbloque angular — CERRADO
Estado: PASS completo en Lite y Plus.

Alcance certificado:
- RAD/DEG/GRAD coherente para trigonometría directa.
- Plantillas visuales con `°` dentro del argumento en DEG/GRAD.
- RAD conserva plantillas sin `°`.
- Las seis trigonométricas directas están cubiertas: sin/cos/tan/sec/csc/cot.
- Las seis inversas convencionales devuelven la unidad angular activa.
- DEG/GRAD etiqueta salida con grados y habilita DMS.
- RAD conserva radianes.
- Símbolo `°` explícito entendido por ambos motores sin doble conversión.
- Casos decimales de inversas cubiertos, incluyendo `asin(0.5)` y `arcsin(0.5)`.
- Composiciones como `sin(asin(0.5))` preservan semántica correcta.
- CI, Playwright, diferencial, mutación, fuzzing, rendimiento, cross-browser, accesibilidad y seguridad: PASS.


### Subbloque Resultado + Formatos — CERRADO
Estado: PASS completo en Lite y Plus.

Certificado:
- jerarquía visual de Resultado alineada;
- selector de formatos convertido a chips sin cambiar nombres ni acciones;
- DMS contextual preservado;
- fracción mixta/impropia preservada;
- aviso de fallback numérico Lite preservado como contrato funcional;
- región accesible Resultado Plus sin duplicación;
- CI, Playwright y gates aplicables: PASS.


### Subbloque Entrada + Pasos — CERRADO
Estado: PASS completo en Lite y Plus.

Certificado:
- superficie visual de Entrada alineada entre ambos proyectos;
- jerarquía Entrada → Resultado → Formatos → Pasos consistente;
- timeline de Pasos numerado y visualmente homologado;
- contratos accesibles preservados;
- layouts split/focus/floating/stacked/separated/fused sin regresiones funcionales;
- corrección adicional en Plus para EDO y'=2x y serializaciones MathLive equivalentes (y′, y^{\\prime}, y^′);
- Playwright E2E, CI, mutación, diferencial, fuzzing, rendimiento, cross-browser, accesibilidad y seguridad: PASS.


### Subbloque Gráficas — shell + selector + rail/visor base — CERRADO
Estado: PASS completo en Lite y Plus.

Certificado:
- shell visual de Gráficas ampliado y alineado al workspace S26;
- selector de tipo 2D/Polar/Paramétrica/3D armonizado;
- Lite: rail de expresiones separado de la superficie de vista/análisis;
- semántica accesible del selector preservada sin romper contratos E2E;
- Plus: corrección de JSX en AnalysisPanel verificada;
- CI, Playwright, accesibilidad, cross-browser, seguridad y gates aplicables: PASS.


### Decisión de proceso — Preview S26 incorporado
Se añade formalmente **S26.3.5 — Preview S26** entre implementación (S26.3) y regresión visual automatizada (S26.4).

Motivo:
- permitir revisión visual humana del rediseño antes de congelar baselines;
- mantener producción estable durante la implementación;
- separar claramente producción, preview y rama de trabajo.

Regla acordada:
- el preview puede habilitarse cuando Gráficas + Matrices estén rediseñadas y verdes;
- el preview no sustituye pruebas ni baselines;
- cualquier ajuste derivado del preview debe aplicarse antes de S26.4.


### Bloque Gráficas — CERRADO
Estado: PASS completo en Lite y Plus.

Cobertura certificada:
- shell visual y selector 2D / Polar / Paramétrica / 3D;
- rail de expresiones/controles y visor separado;
- Gráficas 2D Plus reorganizadas y certificadas;
- Polar, Paramétrica y 3D Plus armonizadas y certificadas;
- visor y análisis Plus armonizados;
- análisis Lite armonizado con el mismo lenguaje visual;
- responsive preservado para desktop, tablet y móvil;
- endpoints, payloads, cálculo y motores sin cambios funcionales;
- gates aplicables completos en verde.

Siguiente bloque: Matrices.

### Subbloque Matrices — shell visual base — CERRADO
Estado: PASS completo en Lite y Plus.

Certificado:
- shell principal reorganizado al patrón S26;
- entrada y resultado separados visualmente;
- responsive desktop/tablet/móvil preservado;
- overflow móvil de Lite corregido;
- operaciones, payloads, worker/API y lógica matemática sin cambios;
- gates aplicables completos en verde.


### Subbloque Matrices — cuadrículas y contención responsive — CERRADO
Cambios:
- cuadrículas agrupadas en tarjetas visuales;
- dimensiones visibles de forma compacta;
- scroll horizontal contenido dentro de la tarjeta cuando una matriz grande no cabe;
- mejora de etiquetas accesibles de celdas en Lite;
- sin cambios en operaciones, API/worker ni motor matemático.

Estado:
- Lite: PASS completo.
- Plus: PASS completo, incluido S19 Mutation Baseline.

### Bloque Matrices — CERRADO
Estado: PASS completo en Lite y Plus.

Cobertura cerrada:
- shell S26;
- entrada/resultado separados;
- cuadrículas y dimensiones refinadas;
- contención responsive de matrices grandes;
- banco A–F y expresión matricial preservados en Lite;
- operaciones existentes preservadas en Plus;
- sin cambios en motores matemáticos;
- todos los gates aplicables en verde.

Hito alcanzado: Gráficas + Matrices cerradas y verdes.
Siguiente paso de proceso: S26.3.5 — Preview S26.

### S26.3.5 — Preview S26 Lite — REVISIÓN HUMANA: FAIL VISUAL

Fecha: 2026-09-24.

La revisión humana del preview Lite confirma que la implementación es funcionalmente estable pero todavía no satisface el contrato visual S26 de forma integral.

Hallazgos confirmados:
- Científica aún no alcanza la composición final pactada en todos sus estados; el historial/ribbon puede competir con Entrada/Resultado y generar espacio muerto;
- Estadística conserva una composición anterior y carece del shell S26 con resultado claramente separado;
- Unidades conserva una composición anterior y el resultado no tiene todavía la jerarquía final acordada;
- Geometría es una base parcial; no puede contarse como módulo visual completo mientras Triángulos/Círculos/Áreas compuestas/Sólidos/Constructor sigan pendientes;
- teclado: aunque el panel Desktop ya respeta 45vh, las pestañas estaban dentro del área desplazable y desaparecían al hacer scroll, contradiciendo el requisito de tabs siempre visibles;
- falta armonización transversal final de los seis layouts y de todas las superficies.

Decisión:
- NO avanzar a S26.4;
- conservar como válidos los PASS funcionales previos, pero reabrir aceptación visual final;
- completar Científica, Estadística, Unidades, Geometría por etapas, Historial/Ajustes y responsive/seis layouts;
- repetir revisión humana del Preview antes de congelar baselines.

Corrección iniciada:
- pestañas del teclado convertidas en cabecera sticky y horizontalmente desplazable;
- contrato reconciliado para incluir Geometría como sexto módulo visible antes de Unidades.

### Cierre de sesión / Handoff — 2026-09-24

Estado de proceso: **PAUSA CONTROLADA PARA RECONFIRMACIÓN VISUAL S26.2R**.

La sesión se cierra deliberadamente para continuar en otra conversación sin perder trazabilidad.

#### Regla de reanudación
La próxima sesión **NO debe empezar modificando código**.

Primero debe:
1. leer `MOCKUP_REGENERATION_BRIEF.md`;
2. regenerar mockups definitivos consolidados;
3. mostrar teclado colapsado y desplegado;
4. reconciliar todos los módulos y breakpoints;
5. presentar al usuario;
6. esperar aprobación explícita.

Solo tras la aprobación se retoma S26.3.

#### Estado de código de referencia
Último SHA de producto relevante antes del cierre documental:
`aaf3dc0f3caebe8ec4c0a554066e4db9e3dd2f46`

Preview:
https://precision-lab-lite-s26.onrender.com

#### Estado técnico
- Científica: reconciliación visual iniciada; proporción Desktop ajustada ~58/42 y historial subordinado.
- Estadística: shell S26 Entrada/Resultado implementado y certificado verde.
- Unidades: shell S26 implementado; CI/Cross-browser/S22/S23/S25 PASS, Playwright FAIL.
- Playwright: 241 PASS, 3 FAIL del mismo test de Unidades en desktop/tablet/mobile.
- Causa exacta: `#units-category` quedó oculto en tablet/desktop por `sm:hidden`; la suite original espera ese select visible. Además cambió el texto exacto del resultado esperado `1000 Metros (m)`.
- No hay evidencia de regresión en `convert()`; el fallo es contrato E2E/UI tras el rediseño.
- Preview Render está activo y se usa para revisión humana.

#### Decisión sobre el teclado
El teclado visible actualmente en Preview **NO constituye el diseño visual final aprobado**.

Debe conservarse su funcionalidad/paridad, pero su composición visual deberá adaptarse al próximo mockup definitivo. El contrato final del teclado se congelará únicamente después de la revisión del usuario.

#### Documentos de continuidad obligatorios
- `qa/s26/HANDOFF_PROMPT.md`
- `qa/s26/MOCKUP_REGENERATION_BRIEF.md`
- `qa/s26/VISUAL_REFERENCE_CHECKLIST.md`
- `qa/s26/ROADMAP.md`
- `qa/s26/KEYBOARD_CONTRACT.md`
- `qa/s26/DESIGN_TARGET.md`
- `qa/s26/RESULT_FORMATS.md`
- `qa/s26/GRAPH_3D_CONTRACT.md`
- `qa/s26/GEOMETRY_CONTRACT.md`
- `qa/s26/BRAND_IDENTITY.md`
- `qa/s26/MATHEMATICAL_INTEGRITY_POLICY.md`
- `qa/s26/TEST_MAPPING.md`

#### No cerrar
- S26.3: no cerrado visualmente.
- S26.3.5 Preview: revisión humana FAIL visual.
- S26.4: NO iniciar.
- S26.5: pendiente.
- S26.6: pendiente.



## S26.3R — Bloque 1 — Shell + Sidebar + Identidad visual — PASS DEFINITIVO

Fecha de cierre: 2026-09-25.

Contrato aplicado:
- navegación lateral azul contractual;
- orden visible: Científica → Gráficas → Matrices → Estadística → Geometría → Unidades;
- identidad PL / PL+ persistente;
- nombre completo visible en estado expandido;
- icono de producto visible también en estado compacto;
- paridad de iconos entre Lite y Plus, con Geometría = cubo;
- Historial y Configuración anclados en la zona inferior;
- dock/panel de teclado reconciliados para no invadir el sidebar;
- auto-colapso responsive por debajo de 1200 px;
- preferencia manual restaurada cuando vuelve a existir ancho suficiente;
- H1 de producto preservado de forma accesible en estado compacto.

HEAD certificado:
- Lite: `fa0ede18dfa67ef8e384f4b2f2170b074722520f`;
- Plus: `09deab33673a035a0327234ee29c6a95a2df5b21`.

Gates:
- Lite: CI, Playwright E2E, S22 PWA Offline, S23 Accessibility, S25 Security y Cross-browser smoke: PASS.
- Plus: CI, Playwright E2E, S17, S18, S19, S20, S21, S23 y S25: PASS.

Decisión:
- Bloque 1 queda congelado salvo defecto reproducible.
- Siguiente bloque contractual: Configuración + Apariencia + selector de layouts.


## S26.3R — Estado certificado Bloques 2–4 — 2026-09-26

### Bloque 2 — Configuración — PASS DEFINITIVO

- ventana independiente;
- Claro/Oscuro/Sistema;
- sidebar sensible al tema;
- Default=fused, Compacto=stacked, Lateral=split;
- legacy separated/focus/floating → fused;
- instalación nueva: split;
- foco/cierre/responsive preservados.

HEAD histórico:
- Lite: `3ceff37f912cb66c3cb46a8e21de46843cdb387f`
- Plus: `ee6136235af29cc52336c16c2c44aadfbd574722`

### Bloque 3 — Historial — PASS DEFINITIVO

- operaciones naturales;
- módulo de origen;
- matrices visibles;
- fecha/hora;
- resultado natural;
- Reusar;
- routing/autofill;
- integral completa al reutilizar en Plus;
- E2E/gates completos.

HEAD histórico:
- Lite: `167df02c734543e093eca726ca9e06488acfb58f`
- Plus: `d1ca0ac6226f8d68c0c85a510f70d1e0fdf5873f`

### Bloque 4 — Resultado + formatos — PASS DEFINITIVO

- selector común;
- etiquetas naturales;
- formatos solo cuando aplican;
- mixta/impropia;
- resultados estructurados Plus alineados;
- encabezado único;
- alineación/escala armonizadas;
- región semántica de resultado preservada;
- regla DD/DMS exclusiva para grados.

Regla angular:
- grados → solo DD / DMS;
- DD con `°`;
- DMS con `°`, `′`, `″`;
- RAD conserva formatos numéricos normales.

HEAD de código certificado:
- Lite: `c878da8183cdab6ca791afcacee6841199a5c067`
- Plus: `40fcf3b3aa2d83fa58943fec603198dd0bb291bb`

Gates Lite: CI, Playwright, S22, S23, S25, Cross-browser — PASS.
Gates Plus: CI, Playwright, S17, S18, S19, S20, S21, S23, S25 — PASS.

### Próximo paso obligatorio

Ejecutar `PARITY_CHECKPOINT_B1_B4.md`, corregir GAPs y recertificar si se modifica código.

**No iniciar Bloque 5 antes de cerrar esa auditoría.**


## 2026-09-26 — Checkpoint B1–B4 cerrado / inicio B5

- Se ejecutó reconciliación estática Lite ↔ Plus contra `PARITY_CHECKPOINT_B1_B4.md`.
- Resultado: **PASS sin GAPs bloqueantes** en B1–B4.
- B1/B2/B3/B4 mantienen paridad contractual; las diferencias documentadas de capacidades Plus/Lite permanecen intencionales.
- Regla angular verificada por código compartido equivalente: salida en grados expone solo DD/DMS; RAD conserva formatos numéricos normales.
- No se modificaron rutas matemáticas protegidas durante el checkpoint.
- Bloque 5 quedó **DESBLOQUEADO / EN CURSO**.
- Alcance B5: shell global del teclado, apertura/cierre y responsive. La paridad de las seis categorías se reserva para B6.
- Lite ya dispone de cobertura equivalente/reforzada en `e2e/keyboard-v5-responsive.spec.ts` y `e2e/keyboard-layouts.spec.ts`.


## 2026-09-26 — Inicio B6 con autoridad visual aprobada

- Decisión explícita: usar `Mockups definitivos de Precision Lab.png` junto con `VISUAL_CONTRACT_FINAL_S26_2R.md` como autoridad visual.
- `KEYBOARD_CONTRACT.md` queda como autoridad funcional/semántica.
- Se elimina como requisito previo regenerar el mockup: la captura aprobada ya existe.
- Próximo trabajo: reconciliación categoría por categoría y tecla por tecla Lite↔Plus.


## 2026-09-26 — B6 Básico implementado

- Se reconciliaron Lite y Plus contra captura + contrato.
- Se congelaron 31 teclas y sus cuatro filas mediante tests.
- Plus recibió tooltips descriptivos faltantes.
- Enter quedó como glyph visual común; `=` conserva inserción sin ejecución.
- Lite dejó la gramática dark legacy del panel Básico y usa tokens `paper/marker/graph` equivalentes a Plus.
- Se creó `B6_BASIC_RECONCILIATION.md`.
- No avanzar a Símbolos hasta revisar gates y Preview de este subbloque.
