# S26.3 — Checkpoint de Paridad Bloques 1–4

Estado: **VALIDACIÓN TÉCNICA COMPLETA; pendiente cierre de S19 Mutation en Plus**

Fecha: 2026-09-26

## Objetivo

Verificar que Precision Lab Lite y Precision Lab Plus mantengan paridad visual, funcional, responsive y de accesibilidad en los bloques S26.3 ya cerrados antes de iniciar el Bloque 5.

Clasificación:
- **PARIDAD**: ambas aplicaciones deben comportarse de la misma forma.
- **DIFERENCIA INTENCIONAL**: diferencia válida por arquitectura/capacidad real de cada motor.
- **GAP CORREGIDO**: divergencia encontrada y corregida durante este checkpoint.
- **DIFERIDO**: diferencia fuera del alcance de Bloques 1–4, reservada para su bloque específico.

## Bloque 1 — Shell global / sidebar

### PARIDAD
- sidebar expandido: 240 px;
- sidebar compacto: 72 px;
- auto-collapse por debajo de 1200 px;
- preferencia de sidebar restaurada al volver a ancho suficiente;
- orden visible: Científica, Gráficas, Matrices, Estadística, Geometría, Unidades;
- Historial y Configuración al pie;
- marca persistente PL / PL+;
- H1 conserva semántica en modo compacto;
- navegación compacta mediante iconos + title/aria-label;
- mismo criterio de sidebar temático.

### GAP CORREGIDO
- Plus reservaba espacio inferior para el dock aun sin contenido registrado.
- Se alineó con Lite: solo se reserva espacio cuando existe content/basicContent/compactActions.

### DIFERENCIA INTENCIONAL
- nombre e icono final distinguen Lite de Plus.
- arquitectura de estado de modo distinta (estado local Lite vs useUIStore Plus), sin diferencia contractual visible.

### DIFERIDO
Los anchos internos de módulos no se consideran GAP de Bloque 1 cuando pertenecen a bloques específicos:
- Científica: se armoniza definitivamente en su bloque específico.
- Estadística: Bloque 9.
- Unidades: Bloque 10.
Matrices, Gráficas y Geometría ya muestran una base de ancho común cercana a 1376 px.

## Bloque 2 — Configuración

### PARIDAD
- ventana/modal independiente fuera del sidebar mediante portal;
- temas visibles: Claro / Oscuro / Sistema;
- layouts visibles: Default / Compacto / Lateral;
- mapping: fused / stacked / split;
- instalaciones nuevas: split;
- layouts legacy separated/focus/floating migran a fused;
- persistencia mediante las mismas claves;
- sidebar responde al tema;
- mismas secciones de apariencia, accesibilidad, teclado y gráficas;
- mismo comportamiento responsive.

### GAP CORREGIDO
Configuración estaba renderizada en ambos motores como role="menu" pese a ser una ventana modal.
Se corrigió en Lite y Plus:
- role="dialog";
- aria-modal="true";
- aria-labelledby;
- foco inicial al botón Cerrar configuración;
- restauración de foco al control previo al cerrar;
- Escape preservado.

### DIFERENCIA INTENCIONAL
- detalles legacy internos de temas no visibles no forman parte del contrato vigente de tres temas.

## Bloque 3 — Historial

### PARIDAD
- HistoryDrawer idéntico en ambas aplicaciones;
- portal fuera del sidebar;
- mismo tamaño, backdrop y scroll interno;
- Escape;
- foco inicial/restaurado;
- fecha y hora;
- módulo de origen separado de la operación;
- nombres naturales de operaciones;
- matrices de entrada visibles;
- resultado matricial visual;
- Reusar;
- navegación al módulo de origen;
- autofill al reutilizar;
- soporte actual certificado para Científica, Matrices, Estadística y Gráficas.

### GAP CORREGIDO
- Lite limitaba el contenido interior a max-w-2xl mientras Plus usaba todo el ancho útil del modal.
- Lite usaba “Borrar todo”; se unificó a “Borrar historial”.
- se unificó el estado vacío:
  - “Todavía no hay cálculos guardados.”
  - “Los cálculos que guardes aparecerán aquí, del más reciente al más antiguo.”

### DIFERENCIA INTENCIONAL
- Lite usa IndexedDB para su persistencia.
- Plus usa su store persistido.
- Plus necesita normalización backend→LaTeX; Lite guarda expresiones en una representación diferente.
Estas diferencias son internas y no deben producir divergencia visible.

### DIFERIDO
Geometría y Unidades todavía no tienen el mismo nivel de integración histórica que los cuatro módulos ya certificados. Se validarán cuando sus bloques funcionales específicos sean implementados.

## Bloque 4 — Resultados + formatos

### PARIDAD
- mismo selector visual de formatos;
- nombres naturales: Exacto / Decimal / Fracción / Científica;
- formatos aparecen solo cuando son aplicables;
- fracción mixta/impropia cuando existe;
- salida angular en grados restringida exclusivamente a:
  - DD — grados decimales;
  - DMS — grados, minutos y segundos;
- DMS usa °, ′ y ″;
- misma jerarquía visual del resultado escalar;
- alineación del valor a la derecha;
- escala tipográfica equivalente;
- encabezado único de Resultado;
- matrices/soluciones estructuradas conservan su presentación apropiada;
- no se altera el valor matemático al cambiar formato.

### GAP CORREGIDO
- Lite podía exponer NaN o forma exacta no útil al tratar una entrada angular.
- Plus podía exponer la representación interna en radianes para una entrada expresada en grados.
- ambos motores ahora presentan únicamente DD/DMS cuando el resultado es angular en grados.
- Lite tenía encabezado visual duplicado de Resultado en split; se eliminó manteniendo aria-label="Resultado".
- Plus tenía menor escala y alineación distinta para escalares; se armonizó con Lite.

### DIFERENCIA INTENCIONAL
Plus conserva capacidades propias del backend:
- pasos detallados;
- badge Resumen;
- warnings;
- Copiar resultado;
- Copiar como LaTeX;
- resultados estructurados provenientes de API.
Estas capacidades no deben eliminarse para forzar una falsa igualdad con Lite.

## Evidencia de certificación

### Lite
HEAD de código del checkpoint: `90b5e3146f7a598ab89d6cb5029c102c67a6e7da`

Gates observados:
- CI: PASS
- Cross-browser: PASS
- S22 PWA Offline: PASS
- S23 Accessibility: PASS
- S25 Security: PASS
- Playwright E2E: PASS

### Plus
HEAD de código del checkpoint: `6564531de850aec435e91188a38b069b0c055142`

Gates observados:
- CI: PASS
- Playwright E2E: PASS
- S17 API fuzzing: PASS
- S18 Differential Properties: PASS
- S20 Performance Robustness: PASS
- S21 Cross-browser Compatibility: PASS
- S23 Accessibility: PASS
- S25 Security: PASS
- S19 Mutation Baseline: **EN EJECUCIÓN al redactar este checkpoint**

## Criterio de cierre

El checkpoint pasa a **PASS DEFINITIVO** cuando S19 Mutation Baseline de Plus finalice en verde sobre el HEAD indicado o un HEAD posterior sin cambios funcionales en Bloques 1–4.

Después del cierre:
1. congelar Bloques 1–4;
2. actualizar EXECUTION_LOG y ROADMAP;
3. iniciar Bloque 5 — shell global del teclado, apertura/cierre/responsive.
