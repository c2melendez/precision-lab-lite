# S26 — Cierre / Handoff de sesión 2026-09-27

Proyecto: **Precision Lab Lite**  
Rama de trabajo: `qa/s26-execution`  
HEAD certificado de código B6: `f029df3d58c421b478a43dac05dd48306a4687a7`

## 1. Estado al cierre

S26.3R:
- B1 Shell / sidebar — **PASS DEFINITIVO**
- B2 Configuración / apariencia / layouts — **PASS DEFINITIVO**
- B3 Historial — **PASS DEFINITIVO**
- B4 Resultado / formatos — **PASS DEFINITIVO**
- B5 Teclado global: shell / apertura / cierre / responsive — **PASS DEFINITIVO**
- B6 Teclado global: arquitectura, inventario y paridad — **PASS DEFINITIVO**
- B7 — **EN CURSO**

## 2. Arquitectura B6 definitiva

La captura aprobada se usa como **autoridad de comportamiento/disposición**, no como inventario literal.

Jerarquía:
1. **Familias arriba**: Álgebra · Trigonometría · Cálculo · Complejos · Símbolos · Unidades · Más.
2. **Subcategorías a la izquierda en Desktop**; pueden reflow a rail horizontal en pantallas estrechas.
3. **Teclas contextuales a la derecha**: solo las de la subcategoría activa.
4. **Núcleo básico permanente al centro en desktop/laptop; contexto a la derecha**.
5. Solo una familia y una subcategoría activas a la vez para reducir densidad.

El núcleo B6 conserva 23 teclas; NO restaurar el inventario histórico de 31 teclas de Básico.

## 3. Decisiones funcionales congeladas

- `=` inserta igualdad y **no ejecuta**.
- Enter virtual ejecuta y Enter físico debe disparar el mismo flujo.
- `^` existe y mantiene paridad con la tecla física.
- `EXP` se eliminó; se conserva `eˣ`.
- MCM/MCD aceptan dos o más argumentos.
- `sgn(a)` y `mod(a,b)` se conservan.
- Límites: x→a, x→∞, x→a⁻, x→a⁺ como cuatro accesos.
- Trigonometría conserva directas, recíprocas, inversas, hiperbólicas e hiperbólicas inversas soportadas.
- Símbolos: variables `x y z t r θ Φ a b c n`, funciones `f(x) g(x) h(x)`, constantes `π e i ∞ φ τ`.
- `Φ` mayúscula = variable/ángulo polar; `φ` minúscula = número áureo; `τ=2π`.
- Acciones `f(x)=0`, Sistema y Simplificar viven solo en **Álgebra → Ecuaciones**.
- El selector de sistemas 2–5 queda visible dentro de esa subcategoría.
- SmartDock visual **Recientes / Var./const. retirado** de todas las disposiciones para recuperar altura.
- El store interno de recientes puede permanecer; no forma parte de la UI B6.

## 4. Últimas correcciones visuales de la sesión

1. Se corrigió el desvío de arquitectura izquierda/centro/derecha.
2. Familias principales se movieron a la franja superior.
3. Subcategorías quedaron separadas de las familias.
4. Cada subcategoría muestra únicamente sus teclas.
5. Se retiró la tira global heredada `f(x)=0 / Sistema / Simplificar`.
6. Se retiró SmartDock de recientes en dock, Apilado y Flotante.
7. Se corrigió contraste de subcategoría activa en Plus.
8. Se preservó el núcleo básico aprobado sin copiar teclas laterales históricas de la captura.

## 5. Gates de cierre

- CI — PASS
- Playwright E2E — PASS
- Cross-browser smoke — PASS
- S23 Accessibility — PASS
- S25 Security — PASS
- S22 PWA Offline — PASS
- S26 Preview workflow — FAIL únicamente en deploy; build/artefacto no constituye bloqueo funcional B6

## 6. Primera acción de la próxima sesión

**NO modificar código antes de verificar visualmente el B6 actual.**

Abrir el preview/build disponible y comprobar:
1. familias arriba;
2. subcategorías separadas;
3. una sola subcategoría visible a la vez;
4. núcleo básico debajo;
5. ninguna tira global de Ecuaciones fuera de Álgebra → Ecuaciones;
6. SmartDock de Recientes ausente;
7. selector Sistema 2–5 visible dentro de Ecuaciones;
8. teclado no tapa Entrada/Resultado/Gráfica y mantiene densidad razonable en Desktop/Tablet/Mobile.

Si la revisión humana es satisfactoria:
- marcar B6 **PASS DEFINITIVO**;
- actualizar ROADMAP / EXECUTION_LOG / B6_KEYBOARD_PARITY_MATRIX;
- continuar con **B7** según ROADMAP vigente.

Si hay una diferencia visual:
- tratarla como corrección B6;
- no alterar inventario ni semántica funcional salvo defecto reproducible;
- volver a ejecutar gates aplicables.

## 7. Autoridad documental

Orden:
1. decisiones explícitas más recientes del usuario;
2. `qa/s26/KEYBOARD_CONTRACT.md`;
3. contrato visual S26.2R;
4. `qa/s26/B6_KEYBOARD_PARITY_MATRIX.md`;
5. captura/mockup aprobados para composición;
6. implementación histórica solo como referencia funcional.

## 8. Advertencias para el agente siguiente

- `B6_BASIC_RECONCILIATION.md` es histórico y está **SUPERSEDIDO**; no usar sus 31 teclas como contrato actual.
- No volver a introducir SmartDock sin nueva decisión explícita.
- No volver a mostrar todas las teclas de una familia simultáneamente.
- No usar la captura aprobada para restaurar x/y/z u otras teclas antiguas al núcleo.
- No declarar B6 PASS definitivo sin revisión humana final posterior a estas últimas correcciones.


## 9. Reapertura operativa — B7 Científica

B6 quedó cerrado como **PASS DEFINITIVO** sobre `f029df3d58c421b478a43dac05dd48306a4687a7`.

Siguiente bloque activo: **B7 — Científica**.

Prioridades:
1. paridad de composición Lite/Plus;
2. Entrada → Resultado → Pasos → Gráfica;
3. estados vacío/resultado/carga/error;
4. cuatro viewports oficiales;
5. Ejemplos/Opciones avanzadas de Plus subordinados al flujo principal;
6. sin cambios de motor salvo defecto reproducible.
