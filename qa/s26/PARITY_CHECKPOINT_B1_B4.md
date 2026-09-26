# S26.3R — Checkpoint de Paridad Bloques 1–4

Fecha de preparación: 2026-09-26  
Branch: `qa/s26-execution`

## Objetivo

Antes de iniciar el Bloque 5, auditar paridad real Lite ↔ Plus en los Bloques 1–4 ya implementados.

Clasificación obligatoria:
- **PARIDAD**: debe coincidir;
- **DIFERENCIA INTENCIONAL**: diferencia válida por capacidades reales;
- **GAP**: divergencia no justificada que debe corregirse antes del Bloque 5.

## HEAD de código certificado previo al checkpoint

- Lite: `c878da8183cdab6ca791afcacee6841199a5c067`
- Plus: `40fcf3b3aa2d83fa58943fec603198dd0bb291bb`

Estos son HEAD de código certificado. Los commits posteriores de documentación no sustituyen esta referencia.

## Bloque 1 — Shell / Sidebar / Identidad

Verificar:
- Científica → Gráficas → Matrices → Estadística → Geometría → Unidades;
- 240 px expandido / 72 px compacto;
- auto-colapso <1200 px y restauración de preferencia;
- PL / PL+ persistente;
- iconos equivalentes;
- Historial y Configuración abajo;
- H1 accesible en compacto;
- convivencia con dock/panel de teclado;
- Desktop/Laptop/Tablet/Mobile.

## Bloque 2 — Configuración / Apariencia / Layout

Verificar:
- ventana independiente;
- Claro / Oscuro / Sistema;
- sidebar sensible al tema;
- Default=fused, Compacto=stacked, Lateral=split;
- migración separated/focus/floating → fused;
- instalación nueva: split;
- X/Escape/foco;
- responsive;
- misma jerarquía visual.

## Bloque 3 — Historial

Verificar:
- ventana independiente centrada;
- operación natural;
- módulo de origen;
- fecha/hora;
- matrices visuales;
- resultado matemático natural;
- Reusar;
- routing al módulo de origen;
- autofill editable;
- integral completa al reutilizar;
- mismo comportamiento al reutilizar dentro del módulo actual.

Diferencia conocida:
- Geometría/Unidades todavía no alimentan Historial con la misma cobertura completa. Documentarla; no ocultarla.

## Bloque 4 — Resultados + formatos

Verificar:
- encabezado único;
- caja visual equivalente;
- alineación derecha;
- escala tipográfica equivalente;
- selector contextual;
- Exacto / Decimal / Fracción / Científica cuando apliquen;
- mixta/impropia;
- matrices/soluciones estructuradas;
- DD/DMS exclusivo para magnitudes angulares en grados;
- DD usa °;
- DMS usa °, ′, ″;
- RAD conserva formatos numéricos normales.

Diferencias intencionales:
- Plus conserva Pasos, Resumen, warnings y Copiar;
- Lite conserva aviso de fallback numérico.

## Regla angular vigente

Cuando el resultado sea una magnitud angular en grados, ofrecer solo:
- **DD** — grados decimales, p. ej. `56.55°`;
- **DMS** — p. ej. `56° 33′ 0.0″`.

No mostrar Exacto / Decimal / Fracción / Científica en ese contexto.

Ejemplos:
- `56.55° ↔ 56° 33′ 0.0″`
- DEG: `asin(0.5) → 30° ↔ 30° 0′ 0.0″`

## Método obligatorio

Para cada bloque:
1. contrato S26.2R;
2. implementación Lite;
3. implementación Plus;
4. pruebas;
5. runtime visual;
6. responsive;
7. accesibilidad;
8. clasificación PARIDAD / DIFERENCIA INTENCIONAL / GAP.

## Regla de salida

No iniciar Bloque 5 hasta:
- completar la matriz B1–B4;
- corregir GAPs;
- recertificar si hubo cambios;
- registrar nuevos HEAD certificados.

Siguiente bloque después del checkpoint:
**Bloque 5 — teclado global: shell, apertura/cierre y responsive.**
