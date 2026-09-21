# Informe de integración V5 — Precision Lab Lite

Fecha: 2026-09-19

## Resultado

Se integró en Lite la arquitectura de teclado aprobada para Plus, manteniendo el diseño, los módulos y las capacidades propias del motor local de Lite.

## Cambios aplicados

- Pantalla dividida (`split`) como disposición inicial en instalaciones nuevas.
- Pestañas de primer nivel `Básico` y `Funciones` visibles en desktop/tablet.
- `Básico` contiene números, operadores, paréntesis, porcentaje, punto decimal, `<`, `>`, `≤`, `≥`, `=`, grados, DMS, prima, `±()`, `ANS`, borrado, `DEL` y Enter.
- `=` inserta el signo en el campo; solo Enter ejecuta el cálculo.
- Variables y constantes se retiraron de Básico y se concentraron en `Símbolos`.
- Variables: `x`, `y`, `z`, `θ`, `Φ` y `r`.
- Constantes/valores: `π`, `e`, `i`, `∞` y `φ`.
- `Φ` mayúscula representa el ángulo polar y se normaliza como la variable `Phi`.
- `φ` minúscula inserta el valor exacto del número áureo: `(1 + √5) / 2`.
- Variables y constantes tienen colores semánticos distintos.
- Se añadieron `sign(a)` y `mod(a,b)` a Álgebra porque el motor Lite ya los ejecutaba.
- Todas las teclas matemáticas tienen tooltip mediante descripción específica o texto accesible de respaldo.
- Se corrigió el normalizador para que las teclas `θ` y `Φ` sean procesables por el motor.
- Se amplió la reserva inferior del contenido en tablet/desktop para que el dock V5 no cubra la pantalla.
- El panel de Funciones desktop se ancla por encima del dock completo y limita su altura con desplazamiento interno.

## Cobertura funcional del teclado

| Sección | Capacidades accesibles |
|---|---|
| Básico | Aritmética, comparación, igualdad, porcentaje, DMS, ANS, edición y ejecución |
| Símbolos | Variables cartesianas/polares y constantes numéricas/complejas |
| Álgebra | Logaritmos, exponenciales, potencias, radicales, valor absoluto, factorial, signo, módulo, ecuaciones, inecuaciones, sistemas, simplificación, GCD y LCM |
| Trigonométricas | Directas, inversas, hiperbólicas e hiperbólicas inversas |
| Cálculo | Integrales, sumatoria, derivadas, límites y ecuaciones diferenciales |
| Complejos | Parte real/imaginaria, argumento, conjugado, módulo, polar, logaritmo, potencias, raíces, forma trigonométrica/exponencial y plano de Argand |
| Módulos | Matrices, Gráficas, Estadística y Unidades se conservaron sin alterar su flujo especializado |

## Funciones deliberadamente deshabilitadas

Las teclas siguen visibles y se presentan con estilo de indisponibilidad porque el motor Lite no ofrece una implementación verificable:

- Productoria `Π`.
- Derivada parcial `∂/∂x`.
- Residuo complejo `Res`.
- Singularidades complejas `Sing`.

No se activaron como teclas falsas: al pulsarlas se informa que todavía no están disponibles.

## Validación

- TypeScript: correcto (`npm run typecheck`).
- Pruebas: 21 archivos, 265 pruebas aprobadas.
- Pruebas V5 nuevas: distribución de Básico, igualdad sin ejecución, DMS, Φ/φ, tooltips, `sign`, `mod` y estados indisponibles.
- Compilación de producción/PWA: correcta (`npm run build`).
- Auditoría responsive estructural: rejilla Básico de 8 columnas, bottom sheet móvil/tablet con scroll y popover desktop sin superposición con el dock.
- Limitación del entorno: el navegador remoto no admite abrir el servidor local; la comprobación responsive fue estructural y automatizada, no una inspección visual por captura.
- Advertencias no bloqueantes heredadas: uso de `eval` dentro de Algebrite y tamaño del bundle principal superior a 500 kB.

## Archivos principales modificados

- `src/components/KeyboardBasicPanel.tsx`
- `src/components/MathKeyboard.tsx`
- `src/components/KeyboardDock.tsx`
- `src/components/KeyboardPanel.tsx`
- `src/App.tsx`
- `src/modes/BasicScientific/BasicScientificMode.tsx`
- `src/store/useLayoutModeStore.ts`
- `src/engine/parsing/constants.ts`
- `src/engine/parsing/normalize.ts`
- `tests/keyboardParityV5.test.ts`
- `tests/parsing.test.ts`
