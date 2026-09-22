# M17 — Paridad funcional y UX Plus ↔ Lite

Fecha: 22 de septiembre de 2026

## Objetivo

Comparar Precision Lab Plus y Precision Lab Lite sobre la superficie real del producto:
navegación, teclado, cálculo, complejos, matrices, gráficas, estadística, unidades,
resultados/pasos y pruebas E2E. Se distingue entre:

1. paridad funcional que debe cerrarse;
2. diferencias intencionales por arquitectura;
3. gaps que requieren un motor nuevo y no deben activarse solo visualmente.

## Resultado de la auditoría

### Paridad ya existente

- Navegación principal: Científica, Matrices, Gráficas, Estadística y Unidades.
- Cálculo: integral indefinida/definida, sumatoria, productoria, derivadas de orden,
  límites finitos/infinito/laterales y EDO.
- Trigonométricas directas, inversas, hiperbólicas e hiperbólicas inversas.
- Complejos básicos: Re, Im, arg, conjugado, módulo, polar, Log(z), potencia,
  raíz n-ésima, Euler y plano de Argand.
- Matrices: suma/resta/producto/Kronecker, transposición, determinante, inversa,
  potencia, REF/RREF, producto punto/cruz, norma, eigen, traza y rango.
- Gráficas: cartesiana/2D, polar, paramétrica y superficie 3D.
- Estadística: descriptiva, combinatoria, distribuciones y correlación/regresión.
- Unidades: misma arquitectura frontend y mismas categorías/conversión.

### Gaps cerrados en M17

#### Derivada parcial

Plus ya ofrecía ∂/∂x como tecla activa; Lite la mostraba como unavailable aunque el motor
ya sabía derivar respecto de una variable.

Cambio:
- se activa la tecla en Lite;
- `\\frac{\\partial}{\\partial x}(...)` se normaliza a `d((...),x)`;
- se reutiliza el mismo motor simbólico existente;
- se añadieron pruebas de parser, motor y E2E.

No se añadió dependencia ni backend.

#### Eigenvalores y eigenvectores

Lite ya calculaba autovectores reales en `eigenOps.ts` y los mostraba en los pasos,
pero el botón decía solo “Eigenvalores”.

Cambio:
- etiqueta actualizada a “Eigenvalores y eigenvectores”;
- tooltip actualizado;
- test de contrato añadido.

### Diferencias intencionales

#### Pasos detallados

Plus usa backend Python/SymPy y puede devolver desarrollo simbólico más rico y verificado.
Lite es browser-only y combina Algebrite, Fraction.js y motores numéricos propios.

Lite sí produce pasos en varias operaciones (cálculo, matrices, sistemas, eigen, etc.),
pero no debe prometer el mismo nivel de desarrollo simbólico general que Plus.

Clasificación: diferencia arquitectónica aceptada, no bug de paridad.

#### Matrices >4x4

Plus permite hasta 6x6 y omite pasos detallados por encima de 4x4.
Lite mantiene MAX_SIZE=4 en UI.

El motor de Lite es mayormente genérico, pero ampliar a 6x6 afecta coste de operaciones,
tamaño de resultados y UX móvil. No se cambia en M17 sin una fase específica de rendimiento.

Clasificación: gap de capacidad conocido, no bloqueante.

#### Eigenvectores complejos

Plus/SymPy puede devolver autovectores complejos.
Lite calcula autovectores para eigenvalores reales; para complejos deja la limitación
explícita y conserva los eigenvalores.

Clasificación: gap arquitectónico conocido.

### Gaps que requieren motor nuevo

#### Res(…, z=…)

Plus lo resuelve con SymPy. Lite no tiene hoy una capa fiable de cálculo de residuos
simbólicos para funciones racionales/meromorfas.

#### Sing(…)

Plus puede obtener singularidades simbólicamente. Lite no dispone de una primitiva
equivalente fiable en su stack browser-only.

Ambas teclas deben permanecer unavailable en Lite hasta implementar y probar un motor
específico. Activarlas solo por paridad visual sería incorrecto.

## Estado de M17

Cerrado en esta fase:
- derivada parcial;
- etiqueta/capacidad declarada de eigenvectores;
- matriz de paridad documentada.

Pendientes deliberados para una fase posterior:
- Res/Sing en Lite;
- matrices 5x5/6x6 en Lite;
- eigenvectores complejos en Lite;
- cualquier intento de igualar el nivel general de pasos de SymPy en una app browser-only.

## Gates requeridos

Antes de fusionar:
- npm ci;
- audit;
- typecheck;
- unitarias/paridad;
- build;
- Playwright completo;
- verificar que M3 siga 132/132 sin flaky.
