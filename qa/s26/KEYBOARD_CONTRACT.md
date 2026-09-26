# S26.2 — Contrato del teclado virtual

## Principio

El rediseño **conserva la botonería y la funcionalidad existentes**. Cambian tema, espaciado, jerarquía, tipografía, estados visuales y adaptación responsive; no se elimina ninguna tecla funcional sin una decisión explícita y prueba de paridad.

## Categorías obligatorias

1. Básico
2. Símbolos
3. Álgebra
4. Trigonométricas
5. Cálculo
6. Complejos

El teclado inicia en **Básico** y permanece colapsado hasta que el usuario lo abra.

## Disponibilidad global

El mismo teclado debe poder abrirse desde:
- Científica
- Matrices
- Gráficas
- Estadística
- Geometría
- Unidades

Cada módulo puede limitar qué acciones interpreta, pero el teclado sigue siendo el mecanismo de entrada global. No se crea un segundo teclado reducido por módulo.

## Tooltips

**Todas las teclas** conservan ayuda contextual. El comportamiento actual de tooltips es la referencia funcional:
- mouse: hover/focus;
- teclado: focus;
- táctil: interacción equivalente ya existente (p. ej. long-press cuando aplique);
- textos concisos en español.

Correcciones explícitas:
- `°`: “inserta el símbolo de grados”.
- `′` (prima): “agrega una prima para escribir ecuaciones diferenciales”.
- `=`: “inserta un signo de igualdad sin ejecutar el cálculo”.

La tecla `=` **no ejecuta**. La ejecución corresponde a Enter/↵ o a la acción primaria del módulo.

## Básico

Se conserva la botonería existente, incluyendo:
- dígitos;
- paréntesis;
- operadores;
- porcentaje;
- comparadores;
- ANS;
- DEL;
- DMS;
- grados `°`;
- prima `′`;
- igualdad `=`;
- Enter/↵.

## Símbolos

Conservar variables y constantes existentes, incluyendo su agrupación visual:
- variables (x, y, z, θ, Φ, r y las ya existentes);
- constantes/valores (π, e, i, ∞, φ y las ya existentes).

Los colores históricos de agrupación pueden cambiar para adoptar la nueva identidad visual.

## Álgebra

Conservar logaritmos, exponenciales, radicales y generales actuales.

### Grupo Ecuaciones — botones obligatorios
- Ecuación lineal / resolver: `f(x)=0`.
- Inecuación lineal: representación tipo `f(x)≥0`.
- Sistema de ecuaciones lineales: bloque con `f(x)=0`, `g(x)=0`.
- Sistema de inequaciones lineales: bloque equivalente con signos ≥/≤.
- Evaluar función en un punto: representación `f(a)` / `x=a`.
- Simplificar: ejemplo visual `a+a→2a`.
- Factorizar: ejemplo visual `x²+2x+1→(x+1)²`.
- LCM / mínimo común múltiplo.
- GCD / máximo común divisor.

## Trigonométricas

Conservar toda la botonería existente:
- directas;
- inversas;
- hiperbólicas;
- hiperbólicas inversas.

## Cálculo

Conservar integrales, sumas/productos, derivadas y ecuaciones diferenciales existentes.

### Límites — cuatro variantes mínimas
1. `lim_{x→a} f(x)`
2. `lim_{x→∞} f(x)`
3. `lim_{x→a^-} f(x)`
4. `lim_{x→a^+} f(x)`

No se eliminan otras variantes ya soportadas por el motor.

## Complejos

Conservar toda la botonería existente:
- Re()
- Im()
- arg()
- conj()
- |z|
- polar
- Log(z)
- potencias/raíces
- forma trigonométrica/exponencial
- residuos/singularidades
- Graficar
- cualquier otra tecla ya presente.

## Responsive

### Desktop
- panel alineado al workspace;
- máximo aproximado 45% de la altura disponible;
- tabs siempre visibles;
- contenido interno con scroll si es necesario.

### Tablet/Mobile
- panel/bottom sheet con scroll interno;
- tabs desplazables horizontalmente si no caben;
- targets táctiles ≈44 px;
- la expresión activa nunca queda permanentemente oculta.

## Regla de integridad

Antes de cerrar S26:
- inventariar tecla por tecla;
- verificar tooltip;
- verificar inserción/acción;
- verificar paridad con motor/ruta;
- registrar excepciones por módulo;
- no aceptar una tecla decorativa sin función documentada.

## S26.3 — Plantillas trigonométricas sensibles al modo angular

Para funciones trigonométricas directas:
- `sin`
- `cos`
- `tan`
- `sec`
- `csc`
- `cot`

el teclado adapta la plantilla según la unidad angular activa.

### DEG/GRAD
Inserta el símbolo de grados **dentro del argumento**, con el placeholder antes del símbolo:
- `sin(□°)`
- `cos(□°)`
- `tan(□°)`
- `sec(□°)`
- `csc(□°)`
- `cot(□°)`

La representación MathLive equivalente utiliza `#0^{\\circ}`.

### RAD
Conserva las plantillas sin símbolo de grado:
- `sin(□)`
- `cos(□)`
- etc.

### Inversas
Las inversas no reciben `°` dentro de su argumento, porque consumen una razón/valor y producen un ángulo. La unidad de **salida** depende de RAD/DEG según el contrato de resultados.

### Integridad
El `°` explícito representa semánticamente grados sexagesimales. Los motores deben reconocerlo sin aplicar una segunda conversión cuando el modo DEG/GRAD ya está activo.

## Autoridad visual B6 — teclado aprobado

Decisión explícita del usuario, 2026-09-26:

Para B6, la autoridad del teclado se congela usando **en conjunto**:

1. `VISUAL_CONTRACT_FINAL_S26_2R.md` — reglas visuales, responsive, jerarquía y restricciones;
2. la captura aprobada **`Mockups definitivos de Precision Lab.png`** — composición visual, densidad, disposición, estados abierto/cerrado y adaptación Desktop/Tablet/Mobile;
3. este `KEYBOARD_CONTRACT.md` — inventario funcional/semántico, categorías, tooltips, inserciones y reglas tecla→motor;
4. decisiones explícitas posteriores del usuario — prevalecen si modifican una decisión anterior.

### Regla de interpretación

- Las capturas son autoridad **visual**, no matemática.
- El contrato del teclado es autoridad **funcional y semántica**.
- La implementación actual no define el diseño aprobado: debe adaptarse a estas autoridades.
- Si una tecla aparece en el contrato pero no es legible o no aparece explícita en la captura, **no se elimina**: se conserva su capacidad y se ubica respetando la composición aprobada.
- Si una captura muestra una notación simplificada o históricamente incorrecta (p. ej. nombres internos como `asin`), prevalece la notación natural y las reglas funcionales vigentes.
- No se introduce un séptimo grupo ni un teclado específico por módulo.
- Lite y Plus deben compartir el mismo teclado visual y semántico; solo pueden diferir en capacidades de motor documentadas y nunca en el significado de una misma tecla.

### Qué queda congelado en B6

B6 debe producir y certificar:

- seis categorías: Básico, Símbolos, Álgebra, Trigonométricas, Cálculo y Complejos;
- orden y agrupación visual compatibles con la captura aprobada;
- inventario tecla por tecla;
- etiqueta visible;
- tooltip;
- LaTeX/plantilla insertada;
- normalización hacia parser/adapter;
- acción esperada;
- soporte Lite;
- soporte Plus;
- estado PASS / GAP / diferencia intencional;
- pruebas automáticas que impidan desviaciones futuras.

### Criterio de cierre visual

B6 **no puede cerrarse únicamente con gates verdes**. Para PASS definitivo deben coincidir:

1. implementación;
2. contrato;
3. captura aprobada;
4. matriz Lite↔Plus;
5. Preview/revisión humana.

La captura aprobada ya existe y **no debe regenerarse como requisito previo**. Si durante B6 se necesita ampliar una categoría que no se ve completa en la lámina general, esa ampliación debe derivarse del contrato vigente y conservar la misma gramática visual, sin reinterpretar el teclado legado como autoridad.

