# S26 B6 — Contrato consolidado del teclado global

**Estado:** aprobado para implementación  
**Ámbito:** Precision Lab Lite y Precision Lab Plus  
**Autoridad visual:** `VISUAL_CONTRACT_FINAL_S26_2R.md` + mockups aprobados  
**Autoridad funcional/semántica:** este documento

## 1. Principio general

Precision Lab utiliza **un único teclado matemático global**, compartido por Lite y Plus y accesible desde Científica, Gráficas, Matrices, Estadística, Geometría y Unidades.

Los módulos pueden conservar controles propios de su flujo, pero no deben reconstruir teclados matemáticos paralelos. Las teclas duplicadas entre familias son accesos alternativos a una misma definición canónica: misma etiqueta funcional, tooltip, inserción, parser y acción.

## 2. Arquitectura espacial aprobada

La captura visual aprobada del 26-09-2026 define **comportamiento y jerarquía**, no inventario histórico de teclas.

### Desktop

1. **Franja superior — familias principales:** Álgebra · Trigonometría · Cálculo · Complejos · Símbolos · Unidades · Más.
2. **Zona contextual intermedia, columna izquierda — subcategorías:** muestra únicamente las subcategorías de la familia activa.
3. **Zona contextual intermedia, panel derecho — teclas:** muestra únicamente las teclas de la subcategoría activa.
4. **Zona inferior — núcleo permanente:** el teclado básico acordado permanece visible y estable debajo de la navegación contextual.

**Regla funcional:** familia → subcategoría → teclas contextuales. El núcleo básico no cambia.

La captura de referencia NO autoriza a recuperar teclas históricas laterales como x/y/z ni otros accesos que ya fueron retirados del núcleo. El inventario funcional vigente de este contrato prevalece.

### Tablet / Mobile

Se conserva exactamente la misma jerarquía lógica. Las familias permanecen en una franja horizontal desplazable. Cuando el ancho sea insuficiente, las subcategorías pueden pasar de columna vertical a una fila/rail horizontal y las teclas contextuales se colocan debajo. El núcleo básico continúa debajo del área contextual.

### Regla de densidad y espacio

El objetivo explícito es **reducir densidad visual**:
- nunca se muestran simultáneamente todas las teclas de todas las subcategorías;
- solo una familia y una subcategoría están activas a la vez;
- las teclas usan densidad compacta;
- el teclado se adapta al espacio libre y **nunca debe tapar permanentemente Entrada, Resultado, Pasos o Gráfica**;
- el área contextual se reacomoda antes de recurrir a desplazamiento interno.

## 3. Núcleo permanente

Básico deja de ser una pestaña independiente y pasa a ser el núcleo siempre visible.

### Números y entrada

`0 1 2 3 4 5 6 7 8 9` · `.` · `(` · `)`

### Operadores y edición

`+` · `−` · `×` · `÷` · `%` · `ANS` · `⌫` · `DEL`

### Igualdad y ejecución

- `=` **solo inserta igualdad; nunca ejecuta**.
- `Enter` ejecuta/evalúa.
- La tecla virtual `Enter` y la tecla física Enter/Return deben invocar **el mismo flujo de evaluación**, salvo en un control multilínea donde Enter tenga semántica explícita de salto de línea.

## 4. Familias principales

**Álgebra · Trigonometría · Cálculo · Complejos · Símbolos · Unidades · Más**

## 5. Álgebra

### Constantes
`π` · `e` · `∞`

### Relaciones
`<` · `>` · `≤` · `≥` · `=`

### Logaritmos
`ln(x)` · `log(x)` · `log₂(x)` · `log_b(x)`

### Potencias y exponenciales
`x²` · `xʸ` · `eˣ` · `10ˣ` · `^`

- `^` es el operador lineal de potencia y debe tener paridad con la tecla física `^`.
- **EXP queda eliminada** para evitar ambigüedad. La exponencial natural se representa como `eˣ`.

### Radicales
`√x` · `ⁿ√x`

No se requiere una tecla `∛x` independiente: la raíz n-ésima cubre ese caso.

### Funciones algebraicas
`|x|` · `x!`

### Transformación
`Simplificar` · `Factorizar` · `Expandir`

### Aritmética de enteros
`MCM(…)` · `MCD(…)` · `sgn(a)` · `mod(a,b)`

- MCM/LCM y MCD/GCD son **de aridad variable**, con mínimo dos argumentos.
- `sgn(a)` es unaria.
- `mod(a,b)` es binaria.
- La etiqueta visible puede ser MCM/MCD aunque el motor utilice `lcm`/`gcd` internamente.

### Ecuaciones e inecuaciones
- `f(x)=0`
- acceso a resolución de inecuaciones, representación tipo `f(x)≥0`

### Sistemas
- sistema de ecuaciones `f=0, g=0`
- sistema de inecuaciones

### Evaluación
`f(a)`

## 6. Trigonometría

### Constantes
`π` · `e` · `∞`

### Directas
`sin(x)` · `cos(x)` · `tan(x)`

### Recíprocas
`csc(x)` · `sec(x)` · `cot(x)`

### Inversas
`sin⁻¹(x)` · `cos⁻¹(x)` · `tan⁻¹(x)`

La interfaz muestra notación natural, no `asin`/`acos`/`atan` como etiqueta principal.

### Hiperbólicas
`sinh(x)` · `cosh(x)` · `tanh(x)`

### Hiperbólicas inversas
`sinh⁻¹(x)` · `cosh⁻¹(x)` · `tanh⁻¹(x)`

Pueden normalizarse internamente a `asinh`/`acosh`/`atanh`.

### DEG / RAD

DEG/RAD es un **estado global**, no una subcategoría.

- En DEG, las funciones trigonométricas directas respetan grados y las inversas producen resultados angulares según el contrato DD/DMS.
- En RAD no se añade `°`.
- Hiperbólicas e hiperbólicas inversas no dependen del modo angular.

## 7. Cálculo

### Constantes
`π` · `e` · `∞`

### Integrales
- integral indefinida
- integral definida

La plantilla debe conservar la notación completa, incluido el diferencial cuando corresponda.

### Derivadas
- derivada ordinaria
- derivadas de orden superior
- derivada parcial

### Sumas y productos
`Σ` · `Π`

### Límites
`x→a` · `x→∞` · `x→a⁻` · `x→a⁺`

Las cuatro variantes son accesos explícitos y no se fusionan en una única tecla genérica.

### Ecuaciones diferenciales
Se exponen únicamente variantes realmente soportadas por el motor.

## 8. Complejos

### Acceso directo
`i` · `π` · `e` · `∞`

### Funciones
`Re(z)` · `Im(z)` · `|z|` · `arg(z)` · `conj(z)`

### Avanzados
- Rectangular → Polar
- Polar → Rectangular
- exponencial compleja
- raíces complejas

Solo se muestran capacidades soportadas.

## 9. Símbolos

### Variables
`x` · `y` · `z` · `t` · `r` · `θ` · `Φ` · `a` · `b` · `c` · `n`

Convenciones:
- `x`: variable/argumento general.
- `y`: segunda variable cuando corresponda.
- `t`: parámetro, especialmente paramétrico/temporal.
- `r`, `θ`, `Φ`: coordenadas/variables polares o espaciales.
- `a`, `b`, `c`: parámetros genéricos.
- `n`: índice entero/contador cuando corresponda.
- `Φ` mayúscula: variable/ángulo polar.

### Funciones
`f(x)` · `g(x)` · `h(x)`

### Constantes
`π` · `e` · `i` · `∞` · `φ` · `τ`

- `φ` minúscula: número áureo.
- `τ = 2π`.
- Variables y constantes deben distinguirse visualmente según el contrato aprobado.

## 10. Unidades

La familia Unidades del teclado facilita la **entrada**; no sustituye el módulo de Conversión de Unidades.

### Ángulos
`°` · `′` · `DMS`

### Fracciones
- fracción simple
- fracción mixta

### Constante útil
`π`

## 11. Más

### Fracciones
- fracción simple
- fracción mixta

### Relaciones y ángulos
`<` · `>` · `≤` · `≥` · `°` · `′` · `DMS`

## 12. Regla de duplicación

Se permite duplicar una tecla cuando mejora claramente el flujo y evita saltos innecesarios entre familias.

Toda duplicación debe apuntar a una **misma definición canónica**: misma inserción, tooltip, parser, accesibilidad y acción. La duplicación es de acceso, no de implementación.

Duplicaciones aprobadas incluyen:
- `π`, `e`, `∞` en Álgebra, Trigonometría y Cálculo;
- `i`, `π`, `e`, `∞` en Complejos;
- Relaciones en Álgebra además de Más;
- `π` en Unidades.

## 13. Tooltips, accesibilidad e integridad

Toda tecla debe tener:
- etiqueta visible apropiada;
- `aria-label`/etiqueta accesible;
- tooltip descriptivo;
- inserción/acción documentada;
- ruta real hacia parser/motor cuando corresponda.

No se acepta una tecla puramente decorativa sin función documentada.

## 14. Plantillas trigonométricas sensibles al modo angular

Para `sin`, `cos`, `tan`, `sec`, `csc`, `cot`:

- DEG: plantilla con `#0^{\circ}` dentro del argumento.
- RAD: plantilla sin símbolo de grado.
- Inversas: no reciben `°` dentro del argumento; la unidad de salida depende del modo global.

El `°` explícito representa grados sexagesimales y no debe provocar una conversión doble.

## 15. Contrato de paridad B6

Cada tecla se registra en una matriz con:

**Familia | Subcategoría | Etiqueta | Tooltip | Inserción/LaTeX | Normalización parser | Acción | Lite | Plus | Estado**

Estados permitidos:
- `PASS`
- `GAP`
- `DIFERENCIA INTENCIONAL`

Lite y Plus deben compartir el mismo teclado visual y semántico. Las únicas diferencias permitidas son capacidades de motor documentadas; una misma tecla nunca cambia de significado entre ediciones.

## 16. Autoridad visual y precedencia

Para B6 mandan, en este orden compatible:

1. decisiones explícitas posteriores del usuario;
2. este contrato para función/semántica;
3. `VISUAL_CONTRACT_FINAL_S26_2R.md` para reglas visuales;
4. mockups aprobados para composición, densidad y responsive.

La implementación histórica no define el diseño aprobado.

## 17. Criterios de cierre B6

B6 solo puede cerrarse cuando:
1. el inventario contractual esté implementado;
2. Lite y Plus mantengan paridad;
3. todas las teclas tengan tooltip y accesibilidad;
4. las duplicaciones compartan definición canónica;
5. el teclado funcione desde todos los módulos;
6. Desktop, Tablet y Mobile respeten el contrato de espacio;
7. existan tests automáticos de inventario, inserción y comportamiento;
8. la revisión visual contra los mockups aprobados sea satisfactoria.

**Regla final:** familias arriba; subcategorías a la izquierda; teclas contextuales a la derecha; núcleo básico permanente debajo.
