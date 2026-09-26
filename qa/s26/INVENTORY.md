# S26.1 — Inventario de superficies reales

Proyecto: **Precision Lab Lite**  
Branch: `qa/s26-execution`

## 1. Navegación visible actual

- Científica (`BasicScientificMode`)
- Matrices (`MatrixMode`)
- Gráficas (`GraphingMode`)
- Estadística (`StatisticsMode`)
- Unidades (`UnitsMode`)

Historial no es pestaña: se abre mediante `HistoryDrawer` + `HistoryPanel`.  
Configuración/personalización: `AjustesPopover`.

## 2. Modos internos/no visibles en navegación principal

- Basic (`SimpleBasicMode`)
- Álgebra (`AlgebraMode`)
- Cálculo (`CalculusMode`)
- Sistemas (`LinearSystemsMode`)

Estos modos **no forman parte de la navegación visual primaria de S26**, porque el producto actual los oculta deliberadamente. Sin embargo, permanecen en el código y deben conservarse sin regresión funcional si alguna ruta interna todavía los alcanza.

## 3. Superficies compartidas obligatorias

- Header y navegación principal.
- Drawer de historial: cerrado, vacío, poblado, restauración/acción disponible según proyecto.
- Ajustes: abierto/cerrado y persistencia.
- Teclado virtual: `KeyboardDock`, `KeyboardBasicPanel`, `KeyboardPanel`, `MathKeyboard`, `RecentKeysBar`.
- Estados de resultado, error, vacío y carga cuando existan.
- Gráficas 2D; 3D cuando el proyecto/componente lo exponga.
- Safe-area y comportamiento responsive.

## 4. Configuraciones visuales globales

### Layout
Se detectaron seis modos de layout:
- `fused`
- `separated`
- `split`
- `focus`
- `stacked`
- `floating`

### Personalización
- Tema seleccionado y modo automático.
- Densidad cómoda/compacta.
- Preferencia de movimiento reducido.
- Paleta de gráfica.

## 5. Viewports de certificación S26

| Alias | Tamaño objetivo | Propósito |
|---|---:|---|
| Desktop | 1440×900 | diseño objetivo principal |
| Laptop | 1280×800 | transición desktop/laptop |
| Tablet | 768×1024 | breakpoint tablet |
| Mobile | 390×844 | móvil moderno |

Si un breakpoint del código requiere un ancho adicional para demostrar una transición crítica, se añade como viewport técnico auxiliar sin reemplazar estos cuatro.

## 6. Estrategia combinatoria

No se probará el producto cartesiano completo de área × estado × viewport × tema × densidad × layout, porque produciría cientos o miles de combinaciones redundantes.

Se aplican estas reglas:
1. **Cada estado funcional principal** se certifica en los cuatro viewports usando la configuración visual por defecto.
2. **Cada layout global** se prueba al menos en Desktop y Mobile; `floating` además debe cruzar explícitamente su breakpoint de degradación.
3. **Tema/densidad/paleta** se prueban como persistencia y como muestras representativas, no sobre cada estado funcional.
4. Toda combinación que históricamente haya producido un defecto obtiene una celda/regresión dedicada.
5. Los modos internos ocultos reciben smoke funcional, no rediseño visual primario salvo que vuelvan a ser expuestos.

## 7. Criterio de cierre de S26.1

S26.1 puede cerrarse cuando:
- toda superficie visible tenga estados definidos en `VISUAL_MATRIX.md`;
- todos los viewports tengan criterio reproducible;
- layouts/configuración tengan cobertura transversal explícita;
- los modos internos ocultos estén identificados y separados del alcance visual primario;
- cada fila de la matriz tenga test funcional asociado o una justificación clara si es puramente visual.
