# S26 — Prompt de continuidad actualizado

Proyecto: **Precision Lab Lite**  
Branch: `qa/s26-execution`  
HEAD de código certificado al cierre del Bloque 4: `c878da8183cdab6ca791afcacee6841199a5c067`

## INSTRUCCIÓN DE ARRANQUE

**No empieces implementando el Bloque 5.**

Primero ejecuta el **Checkpoint de Paridad S26.3R — Bloques 1–4**.

Lee:
1. `qa/s26/PARITY_CHECKPOINT_B1_B4.md`
2. `qa/s26/RESULT_FORMATS.md`
3. `qa/s26/ROADMAP.md`
4. final de `qa/s26/EXECUTION_LOG.md`
5. `qa/s26/DESIGN_TARGET.md`
6. `qa/s26/KEYBOARD_CONTRACT.md`
7. `qa/s26/MATHEMATICAL_INTEGRITY_POLICY.md`

## Estado

S26.2R: aprobado/congelado.

S26.3R:
- B1 Shell/Sidebar: PASS DEFINITIVO.
- B2 Configuración: PASS DEFINITIVO.
- B3 Historial: PASS DEFINITIVO.
- B4 Resultados/Formatos: PASS DEFINITIVO.
- B5 Teclado shell/open-close/responsive: pendiente y bloqueado hasta cerrar paridad B1–B4.

## Checkpoint

Auditar Lite vs Plus:
- B1 shell/sidebar/branding/responsive;
- B2 configuración/tema/layouts/persistencia;
- B3 historial/Reusar/routing/autofill/matrices/fecha-hora;
- B4 resultados/formatos/estructurados/angular.

Clasificación:
- PARIDAD;
- DIFERENCIA INTENCIONAL;
- GAP.

Corrige todos los GAPs antes de B5 y recertifica si tocas código.

## Regla angular definitiva

Salida angular en grados:
- solo DD y DMS;
- DD = grados decimales con `°`;
- DMS = `°`, `′`, `″`;
- ocultar Exacto/Decimal/Fracción/Científica.

RAD conserva formatos numéricos normales.

## Diferencias intencionales conocidas

Plus:
- SymPy/backend;
- Pasos;
- Resumen;
- warnings;
- Copiar resultado / Copiar LaTeX;
- resultados estructurados API.

Lite:
- cálculo local;
- aviso de fallback numérico.

No elimines capacidades reales para forzar paridad.

## Documentación obligatoria

Tras cualquier corrección:
- actualizar `EXECUTION_LOG.md`;
- actualizar `ROADMAP.md`;
- actualizar `PARITY_CHECKPOINT_B1_B4.md`;
- registrar HEAD certificado;
- distinguir commits documentales de HEAD de código certificado.

## Después del checkpoint

Bloque 5:
**Teclado global — shell, apertura/cierre y responsive.**
