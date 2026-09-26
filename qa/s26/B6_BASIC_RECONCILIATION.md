# S26.3R — B6 Básico · Reconciliación contractual Lite ↔ Plus

**Estado:** IMPLEMENTADO — pendiente gates + Preview/revisión humana  
**Autoridad visual:** `VISUAL_CONTRACT_FINAL_S26_2R.md` + `Mockups definitivos de Precision Lab.png`  
**Autoridad funcional:** `KEYBOARD_CONTRACT.md`

## 1. Objetivo

Congelar la categoría **Básico** del teclado oficial de Precision Lab antes de avanzar a Símbolos. La implementación actual no se usa como autoridad: se reconcilia contra captura + contrato.

## 2. Inventario aprobado

Total: **31 teclas**, distribuidas en cuatro filas lógicas:

| Fila | Teclas |
|---|---|
| 1 | `7` · `8` · `9` · `(` · `)` · `⌫` · `DEL` · `ANS` |
| 2 | `4` · `5` · `6` · `×` · `÷` · `%` · `<` · `>` |
| 3 | `1` · `2` · `3` · `+` · `−` · `.` · `=` · `′` |
| 4 | `0` · `°` · `DMS` · `±()` · `≤` · `≥` · `Enter` |

`Enter` ocupa visualmente dos columnas para cerrar la rejilla de ocho columnas.

## 3. Contrato tecla → acción

| Tecla | Inserción / acción | Tooltip contractual | Estado Lite ↔ Plus |
|---|---|---|---|
| 0–9 | dígito literal | inserta el número correspondiente | PARIDAD |
| ( | `(` | abre un grupo o prioridad | PARIDAD |
| ) | `)` | cierra el grupo | PARIDAD |
| × | `\\cdot` | multiplica izquierda × derecha | PARIDAD |
| ÷ | `\\frac{#0}{#1}` | fracción editable | PARIDAD |
| + | `+` | suma dos valores | PARIDAD |
| − | `-` | resta derecha a izquierda | PARIDAD |
| . | `.` | separador decimal | PARIDAD |
| % | `\\%` | inserta símbolo de porcentaje | PARIDAD |
| < | `<` | menor que | PARIDAD |
| > | `>` | mayor que | PARIDAD |
| ≤ | `\\le` | menor o igual | PARIDAD |
| ≥ | `\\ge` | mayor o igual | PARIDAD |
| = | `=` | inserta igualdad **sin ejecutar** | PARIDAD |
| ′ | `'` | prima para EDO | PARIDAD |
| ° | `°` | símbolo de grados | PARIDAD |
| DMS | `#0°#1′#2″` | plantilla grados/minutos/segundos | PARIDAD |
| ±() | `\\pm\\left(#0\\right)` | alternativas ± | PARIDAD |
| ⌫ | borrar un carácter | borra el último carácter | PARIDAD semántica |
| DEL | limpiar campo | borra todo el campo | PARIDAD semántica |
| ANS | último resultado | inserta último resultado disponible | PARIDAD |
| Enter | ejecutar | ejecuta/resuelve expresión actual | PARIDAD |

## 4. Reglas congeladas

1. `=` **jamás ejecuta**.
2. **Enter** es la acción primaria de ejecución desde el teclado.
3. `ANS`, `DEL`, `DMS`, `°`, `′`, comparadores y Enter pertenecen a Básico.
4. Variables y constantes **no aparecen** en Básico; viven en Símbolos.
5. Todas las 31 teclas deben tener tooltip real, no depender solamente del `aria-label`.
6. Lite y Plus deben mostrar la misma etiqueta visible **Enter**.
7. Las diferencias internas de implementación (callbacks en Lite vs comandos MathLive en Plus) son aceptables solo si la semántica visible es idéntica.

## 5. Gramática visual aprobada

- rejilla compacta de 8 columnas en Desktop;
- targets con borde, radio y sombra sutil;
- números/entrada: superficie neutra `paper`;
- operadores: acento `marker`;
- comparadores e igualdad: énfasis secundario con borde/acento;
- Enter: acción primaria `graph`;
- tokens temáticos, no colores legacy fijos;
- adaptación automática a Claro/Oscuro/Sistema;
- en Tablet/Mobile se conserva contenido, con scroll del contenedor global cuando sea necesario.

## 6. Correcciones realizadas en B6

- Plus: tooltips descriptivos completos para teclas básicas que todavía dependían del label.
- Lite y Plus: etiqueta visible de ejecución unificada a **Enter**, conforme al mockup aprobado.
- Lite: ejecución se identifica por semántica `ariaLabel=calcular`, no por un glyph heredado.
- Lite: clases visuales de Básico alineadas con la gramática theme-aware usada por Plus.
- Ambos: gate de inventario exacto de 31 teclas, filas aprobadas y presencia obligatoria de tooltip.

## 7. Criterio de cierre

Este documento no declara PASS definitivo por sí solo. Básico se cierra cuando:

- CI/unit tests: PASS;
- Playwright/E2E: PASS;
- inventario contractual: PASS;
- Preview disponible;
- revisión humana confirma coincidencia razonable con la captura aprobada.

Después de ese cierre se continúa con **B6 — Símbolos**.
