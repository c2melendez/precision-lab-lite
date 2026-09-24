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
