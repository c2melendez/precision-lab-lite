# S26 — Matriz visual y funcional

Viewports oficiales: **Desktop 1440×900 · Laptop 1280×800 · Tablet 768×1024 · Mobile 390×844**.  
La configuración visual por defecto se usa para la matriz principal; layouts/temas/densidad se certifican en la cobertura transversal.

## A. Superficies visibles

| Área | Estado | Desktop | Laptop | Tablet | Mobile | Test funcional asociado | Estado |
|---|---|---:|---:|---:|---:|---|---|
| Shell | carga inicial | ☐ | ☐ | ☐ | ☐ | app monta + navegación visible | PENDIENTE |
| Shell | cambio entre modos | ☐ | ☐ | ☐ | ☐ | navegación conserva estado esperado | PENDIENTE |
| Científica | vacío | ☐ | ☐ | ☐ | ☐ | entrada utilizable | PENDIENTE |
| Científica | expresión larga | ☐ | ☐ | ☐ | ☐ | expresión preservada + caret | PENDIENTE |
| Científica | resultado escalar | ☐ | ☐ | ☐ | ☐ | cálculo conocido | PENDIENTE |
| Científica | ecuación/sistema desde router | ☐ | ☐ | ☐ | ☐ | resultado correcto | PENDIENTE |
| Científica | cálculo diferencial/integral/límite | ☐ | ☐ | ☐ | ☐ | intención → motor → resultado | PENDIENTE |
| Científica | error controlado | ☐ | ☐ | ☐ | ☐ | error visible sin romper UI | PENDIENTE |
| Matrices | vacío | ☐ | ☐ | ☐ | ☐ | entrada de matriz | PENDIENTE |
| Matrices | 2×2 | ☐ | ☐ | ☐ | ☐ | determinante/operación conocida | PENDIENTE |
| Matrices | 3×3 | ☐ | ☐ | ☐ | ☐ | inversa/operación conocida | PENDIENTE |
| Matrices | error | ☐ | ☐ | ☐ | ☐ | matriz inválida controlada | PENDIENTE |
| Gráficas | vacío | ☐ | ☐ | ☐ | ☐ | navegación + canvas/visor listo | PENDIENTE |
| Gráficas | una curva | ☐ | ☐ | ☐ | ☐ | función/puntos correctos | PENDIENTE |
| Gráficas | múltiples curvas | ☐ | ☐ | ☐ | ☐ | series independientes | PENDIENTE |
| Gráficas | interacción | ☐ | ☐ | ☐ | ☐ | zoom/pan/controles aplicables | PENDIENTE |
| Gráficas | error | ☐ | ☐ | ☐ | ☐ | error controlado | PENDIENTE |
| Estadística | vacío | ☐ | ☐ | ☐ | ☐ | ingreso de datos | PENDIENTE |
| Estadística | dataset | ☐ | ☐ | ☐ | ☐ | edición/listado usable | PENDIENTE |
| Estadística | resultado | ☐ | ☐ | ☐ | ☐ | media/mediana/desv. esperadas | PENDIENTE |
| Estadística | error/dato inválido | ☐ | ☐ | ☐ | ☐ | validación controlada | PENDIENTE |
| Unidades | categoría | ☐ | ☐ | ☐ | ☐ | selección usable | PENDIENTE |
| Unidades | resultado | ☐ | ☐ | ☐ | ☐ | conversión conocida | PENDIENTE |
| Unidades | cambio de unidades | ☐ | ☐ | ☐ | ☐ | valor se conserva/recalcula correctamente | PENDIENTE |
| Historial | cerrado | ☐ | ☐ | ☐ | ☐ | contenido principal usable | PENDIENTE |
| Historial | vacío | ☐ | ☐ | ☐ | ☐ | apertura/cierre + foco | PENDIENTE |
| Historial | poblado | ☐ | ☐ | ☐ | ☐ | entradas visibles + acción disponible | PENDIENTE |
| Ajustes | cerrado | ☐ | ☐ | ☐ | ☐ | app usable | PENDIENTE |
| Ajustes | abierto | ☐ | ☐ | ☐ | ☐ | controles navegables | PENDIENTE |
| Ajustes | persistencia | ☐ | ☐ | ☐ | ☐ | recarga conserva preferencias | PENDIENTE |
| Teclado | cerrado/oculto cuando aplica | ☐ | ☐ | ☐ | ☐ | input usable | PENDIENTE |
| Teclado | básico | ☐ | ☐ | ☐ | ☐ | teclas base → input/acción | PENDIENTE |
| Teclado | panel expandido/categorías | ☐ | ☐ | ☐ | ☐ | tecla↔función | PENDIENTE |
| Teclado | recientes | ☐ | ☐ | ☐ | ☐ | historial reciente coherente | PENDIENTE |
| Teclado | long-press/acciones especiales | ☐ | ☐ | ☐ | ☐ | semántica especial preservada | PENDIENTE |

## B. Cobertura transversal de layout

| Layout | Desktop | Mobile | Criterio funcional | Estado |
|---|---:|---:|---|---|
| fused | ☐ | ☐ | input/resultado/teclado sin solapamiento | PENDIENTE |
| separated | ☐ | ☐ | paneles separados utilizables | PENDIENTE |
| split | ☐ | ☐ | distribución y foco correctos | PENDIENTE |
| focus | ☐ | ☐ | teclado/dock y contenido accesibles | PENDIENTE |
| stacked | ☐ | ☐ | flujo vertical sin dock fijo superpuesto | PENDIENTE |
| floating | ☐ | ☐ | ventana flotante + degradación por breakpoint | PENDIENTE |

> `floating` debe incluir un viewport técnico a cada lado de su breakpoint real para probar la transición, además de Desktop/Mobile.

## C. Personalización

| Configuración | Casos mínimos | Evidencia | Estado |
|---|---|---|---|
| Tema | default + automático + claro/oscuro + alto contraste representativo | screenshot + persistencia | PENDIENTE |
| Densidad | cómoda + compacta | screenshot + persistencia | PENDIENTE |
| Movimiento | sistema + reducido explícito | comportamiento sin animación problemática | PENDIENTE |
| Paleta gráfica | default + alternativa + opción apta para daltonismo | gráfica real | PENDIENTE |

## D. Modos internos/no visibles

Los modos ocultos deliberadamente de la navegación principal reciben **smoke funcional**, no rediseño visual primario. Su lista exacta está en `INVENTORY.md`.

| Cobertura | Resultado |
|---|---|
| Montaje/ruta interna si aplica | ☐ |
| Entrada básica | ☐ |
| Resultado conocido | ☐ |
| Sin regresión por cambios compartidos | ☐ |

## Evidencia mínima por celda aprobada

- screenshot/baseline reproducible;
- commit SHA;
- viewport;
- layout/tema si difiere del default;
- nombre del test funcional;
- PASS/FAIL;
- defecto asociado si aplica.

## Regla de cierre

Una celda visual solo puede marcarse aprobada cuando el recorrido funcional asociado también pasa. Una captura por sí sola no cierra la fila.
