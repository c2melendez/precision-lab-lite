# S26 B6 — Matriz de paridad del teclado global

Fecha de cierre técnico: **2026-09-27**  
Proyecto: **Precision Lab Lite**  
Rama: `qa/s26-execution`  
HEAD certificado de código: `cdd8e35ac6ddcb670f6dbdfe0bf79fa1fde7c9ec`  
Estado: **PASS AUTOMATIZADO — pendiente confirmación visual humana final**

## 1. Arquitectura

| Contrato | Lite | Plus | Estado |
|---|---|---|---|
| Familias principales arriba | Sí | Sí | PASS |
| 7 familias: Álgebra, Trigonometría, Cálculo, Complejos, Símbolos, Unidades, Más | Sí | Sí | PASS |
| Subcategorías separadas de familias | Sí | Sí | PASS |
| Solo una subcategoría visible a la vez | Sí | Sí | PASS |
| Panel de teclas contextual | Sí | Sí | PASS |
| Núcleo básico permanente debajo | Sí | Sí | PASS |
| Responsive Desktop/Tablet/Mobile | Sí | Sí | PASS automático |
| SmartDock Recientes visible | No | No | PASS — retirado |
| Tira global f(x)=0/Sistema/Simplificar | No | No | PASS — retirada |
| Acciones de Ecuaciones solo en Álgebra → Ecuaciones | Sí | Sí | PASS |

## 2. Núcleo permanente B6

Inventario canónico: **23 teclas**.

- Fila 1: `7 8 9 ( ) ⌫`
- Fila 2: `4 5 6 × ÷ %`
- Fila 3: `1 2 3 + − .`
- Fila 4: `0 ANS DEL = Enter`

Reglas:
- `=` inserta; no ejecuta.
- Enter virtual ejecuta.
- Enter físico usa el mismo flujo de ejecución.
- Relaciones, ángulos, DMS y ±() viven fuera del núcleo.

## 3. Familias y subcategorías implementadas

### Álgebra
Subcategorías vigentes:
- Constantes (inyectada por B6)
- Logaritmos
- Exponenciales
- Radicales
- Generales
- Ecuaciones

Contenido relevante:
- π/e/∞;
- ln/log/log₂/log_b;
- potencias/exponenciales, incluido `^`;
- radicales;
- |a|, factorial, sgn, mod;
- f(x)=0, inecuación, sistema, sistema de inecuaciones, simplificar, LCM/MCM, GCD/MCD;
- selector de sistema 2–5 dentro de Ecuaciones.

**Nota de reconciliación:** el mockup histórico menciona etiquetas como “Transformación”, “Sistemas” y “Evaluación”, pero la implementación B6 actual agrupa esas acciones dentro de las subcategorías vigentes. No recrearlas solo por aparecer en una captura antigua sin decisión explícita nueva.

### Trigonometría
- Constantes
- Directas
- Recíprocas
- Inversas
- Hiperbólicas
- Hiperbólicas inversas

Hiperbólicas inversas actuales incluyen:
`sinh⁻¹ cosh⁻¹ tanh⁻¹ csch⁻¹ sech⁻¹ coth⁻¹`.

DEG/RAD permanece global.

### Cálculo
- Constantes
- Integrales
- Sumas y productos
- Derivadas
- Límites
- Ecuaciones diferenciales

Límites explícitos:
`x→a`, `x→∞`, `x→a⁻`, `x→a⁺`.

### Complejos
- Constantes/acceso directo
- Funciones
- Avanzado

`convertir a forma polar` pertenece a **Funciones**.  
Log complejo, potencias/raíces, forma trig/exponencial, residuos/singularidades y otras capacidades soportadas permanecen en Avanzado según inventario real.

### Símbolos
- Variables: `x y z t r θ Φ a b c n`
- Constantes y valores: `π e i ∞ φ τ`
- Funciones: `f(x) g(x) h(x)`

### Unidades
- Ángulos
- Fracciones
- constante útil π según contrato vigente.

### Más
- Fracciones
- Relaciones/ángulos
- Signos, incluido `±()`.

## 4. Decisiones congeladas

- `EXP` eliminado.
- `eˣ` permanece.
- `^` físico/virtual debe conservar paridad.
- MCM/MCD: aridad variable, mínimo dos argumentos.
- `sgn(a)` unaria.
- `mod(a,b)` binaria.
- `Φ` ≠ `φ`.
- `τ = 2π`.
- Duplicaciones permitidas solo como accesos a la misma semántica.
- Todas las teclas deben conservar tooltip y nombre accesible.

## 5. Disponibilidad global

El teclado B6 es global para:
1. Científica
2. Gráficas
3. Matrices
4. Estadística
5. Geometría
6. Unidades

No crear teclados específicos duplicados por módulo.

## 6. Gates certificados

### Lite
- CI PASS
- Playwright E2E PASS
- Cross-browser PASS
- S23 Accessibility PASS
- S25 Security PASS
- S22 PWA Offline PASS
- S26 Preview workflow: fallo de deploy separado; no es regresión funcional B6

### Plus
- CI PASS
- Playwright E2E PASS
- S17 PASS
- S18 PASS
- S19 PASS
- S20 PASS
- S21 PASS
- S23 PASS
- S25 PASS

## 7. Pendiente único para PASS DEFINITIVO

Revisión humana de la última composición:
- familias arriba;
- subcategorías separadas;
- panel contextual compacto;
- núcleo debajo;
- SmartDock ausente;
- acciones Ecuaciones solo en su subcategoría;
- selector 2–5 visible;
- sin solapar Entrada/Resultado/Gráfica;
- densidad razonable en Desktop/Tablet/Mobile.

Después de esa revisión se puede cambiar el estado a **PASS DEFINITIVO** y abrir B7.


## Cierre de matriz — 2026-09-27

HEAD certificado: `cdd8e35ac6ddcb670f6dbdfe0bf79fa1fde7c9ec`.

### Arquitectura final certificada
| Contrato | Estado |
|---|---|
| Núcleo permanente de 23 teclas | PASS |
| Básico no es pestaña | PASS |
| 7 familias arriba | PASS |
| Subcategorías separadas de familias | PASS |
| Una sola subcategoría visible a la vez | PASS |
| Teclas contextuales solo de subcategoría activa | PASS |
| Núcleo básico debajo | PASS |
| `=` inserta y no ejecuta | PASS |
| Enter virtual/físico mismo flujo | PASS |
| SmartDock visual retirado | PASS |
| Acciones rápidas globales retiradas | PASS |
| Sistema 2–5 dentro de Álgebra → Ecuaciones | PASS |
| Acceso global desde módulos | PASS E2E |
| Desktop/Tablet/Mobile automáticos | PASS |

Gates:
CI, Playwright E2E, S22 PWA Offline, S23 Accessibility, S25 Security y Cross-browser smoke: PASS. S26 Preview: build-preview/composición/upload de artefacto PASS; deploy Pages FAIL.

### Estado B6
**PASS AUTOMÁTICO / pendiente confirmación visual humana final.**

Cualquier sección histórica de esta matriz que mencione:
- “Desktop izquierda/centro/derecha”;
- “Básico 31 teclas”;
- SmartDock como superficie vigente;

queda supersedida por este cierre y por `KEYBOARD_CONTRACT.md`.
