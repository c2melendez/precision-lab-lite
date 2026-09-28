# S26 B7 — Contrato visual y funcional definitivo del módulo Científica

Estado: **ACTIVO — autoridad específica de B7**
Fecha de consolidación: **2026-09-28**

## 1. Alcance y autoridad

Este documento define la composición, interacción y semántica visual de **Científica** para Precision Lab Lite y Precision Lab Plus.

Orden de autoridad dentro de B7:
1. decisiones explícitas más recientes del usuario;
2. este contrato;
3. `VISUAL_REFERENCE_CHECKLIST.md`;
4. `RESULT_FORMATS.md`, `KEYBOARD_CONTRACT.md`, `MATHEMATICAL_INTEGRITY_POLICY.md` y demás contratos funcionales;
5. implementación previa, solo cuando no contradiga lo anterior.

B6 permanece cerrado. B7 puede modificar componentes compartidos de bloques anteriores cuando sea necesario para cumplir este contrato, siempre con recertificación de no regresión.

## 2. Superficies primarias de Científica

La vista principal de Científica se compone de **cuatro superficies primarias**:

1. **Entrada**
2. **Resultado**
3. **Entradas previas de la sesión**
4. **Gráfica / vista previa**

**Pasos de solución** es una superficie secundaria debajo del workspace principal. Puede crecer verticalmente y no compite por el viewport principal.

El teclado global queda fuera de estas cuatro superficies y no debe cubrirlas.

## 3. Diseños de escritorio

Configuración → Apariencia → Diseño debe ofrecer únicamente cuatro presets para Científica:

### Balanceada
Gráfica amplia a la derecha; Entrada, Resultado y Entradas previas en la zona izquierda.

### Cálculo amplio
Entrada recibe mayor ancho; Gráfica conserva área sustancial; Resultado y Entradas previas se acomodan sin perder legibilidad.

### Resultado amplio
Resultado recibe mayor protagonismo; Gráfica conserva área sustancial; Entrada y Entradas previas permanecen accesibles.

### Cuadrícula 2×2
Fila 1: Entrada | Resultado
Fila 2: Entradas previas | Gráfica

No se ofrece un modo completamente vertical en desktop. Tablet y móvil pueden apilarse responsivamente.

## 4. Entrada

- La tipografía matemática natural de Lite es la referencia visual.
- Debe haber una sola acción primaria de cálculo: **flecha circular azul**.
- Se elimina el botón rectangular “Calcular” de la superficie principal.
- Debe existir un único acceso compacto al teclado.
- `=` inserta igualdad; **Enter** ejecuta.
- RAD/GRAD permanece visible y discreto.
- Entrada debe conservar suficiente espacio incluso con teclado abierto.

## 5. Resultado

Resultado usa una tarjeta propia y estable en vacío, éxito y error.

Formatos contextuales:
- Exacto
- Decimal
- Científica
- Fracción cuando exista forma exacta
- Mixta/impropia cuando corresponda
- DD/DMS para resultados angulares cuando corresponda

Reglas:
- solo aparecen formatos útiles;
- todos los formatos usan la misma identidad de tipografía matemática natural;
- no se muestran comandos LaTeX crudos;
- una integral indefinida incluye **+C**;
- una integral definida no incluye **+C**;
- inecuaciones muestran el conjunto solución de forma canónica;
- sistemas y resultados estructurados conservan su estructura matemática.

### Copiar
Se conservan dos acciones minimalistas:
- **Copiar resultado**: copia la representación activa.
- **Copiar como LaTeX**: copia el LaTeX canónico de la representación activa.

La confirmación es discreta (“Copiado”), sin modal.

## 6. Entradas previas de la sesión

Es una superficie distinta del Historial persistente.

- Muestra únicamente entradas recientes de la sesión actual.
- Desktop intenta mostrar hasta 5, reduciendo el número visible si el espacio o longitud de expresiones lo exige.
- Tablet/móvil pueden mostrar menos.
- No usa scroll interno.
- Cuando entra una nueva y se supera la capacidad visible, desaparece la más antigua **solo de esta vista**, no del Historial.
- Cada entrada es reutilizable con un clic: restaura la expresión completa en Entrada, lista para editar, **sin ejecutar automáticamente**.
- Se presenta en matemática natural, nunca como sintaxis de backend o texto monoespaciado crudo.

El Historial completo sigue siendo persistente hasta que el usuario lo borre.

## 7. Gráfica en Científica

La gráfica de Científica es una **vista previa visual ligera**. No es un mini módulo de Gráficas.

Debe:
- mostrar ejes/grid limpios cuando corresponda;
- autoajustar escala a la operación;
- evitar tablas, listas extensas, máximos/mínimos, asíntotas y análisis detallado;
- presentar un estado limpio cuando la visualización no aplica, no es necesaria o requiere una vista avanzada.

Estados semánticos:
- **Vista previa disponible**
- **Representación gráfica no necesaria**: por ejemplo resultado netamente aritmético/constante.
- **Representación no aplicable en esta vista**: no existe una visualización honesta y útil en Científica.
- **Requiere vista avanzada**: el objeto matemático necesita análisis especializado en Gráficas.

La tarjeta permanece en la cuadrícula aunque no haya curva.

## 8. Semántica de la vista previa según operación

La gráfica consume la **operación matemática canónica**, nunca el texto renderizado de Resultado.

### Función directa
Grafica la función de entrada.

### Derivada
Muestra función original + derivada; la derivada es más prominente.

### Derivadas de orden superior
Original + resultado solicitado; evitar acumulación innecesaria de curvas.

### Integral indefinida
Integrando + una antiderivada representativa con **C=0 solo para visualización**. Resultado conserva +C.

### Integral definida
Función + límites + región de integración correspondiente. Debe respetar el significado firmado de la integral.

### Límites
La visualización prioriza el **comportamiento de aproximación**:
- bilateral: ambos lados de x→a;
- lateral izquierdo: énfasis solo en x→a⁻;
- lateral derecho: énfasis solo en x→a⁺;
- laterales distintos: representar ambos comportamientos y que el bilateral no existe;
- límite infinito en punto finito: enfatizar aproximación/asíntota;
- límite al infinito: enfatizar comportamiento lejano.

El encuadre se adapta automáticamente al punto, lado o dirección del límite.

### Simplificación / factorización
Compara original/transformada solo si aporta información. Debe respetar restricciones de dominio y no sugerir equivalencia donde el dominio cambia.

### EDO
- solución particular: grafica la solución;
- familia: unas pocas curvas representativas o relación implícita, claramente marcadas como representativas;
- no se fuerza la ecuación diferencial original como curva adicional.

### Sistemas de ecuaciones
- 2 ecuaciones / 2 variables: curvas componentes + intersecciones comunes;
- sin solución: mostrar ambas sin inventar cruce;
- coincidentes: una curva + indicación de infinitas soluciones;
- 3+ variables: no fingir 2D; derivar a Gráficas/3D cuando corresponda.

### Inecuación
- una variable: recta real cuando sea la representación más clara;
- dos variables: frontera + región solución;
- estricta (<, >): frontera visualmente no incluida;
- inclusiva (≤, ≥): frontera incluida.

### Sistema de inecuaciones
Todas las fronteras + únicamente la intersección factible. Debe representar correctamente regiones vacías y no acotadas.

### Complejos
- número complejo aislado: plano de Argand, punto (Re, Im);
- múltiples raíces/soluciones complejas: puntos en Argand;
- función compleja de variable real: curvas Re e Im cuando sea útil;
- función genuina de variable compleja f(z): no fingir una curva cartesiana 2D. Usar una representación compleja compacta solo si es matemáticamente honesta; domain coloring, superficies y mapeos pertenecen a Gráficas.

Regla general: la vista previa selecciona representación según **dominio/codominio**, no fuerza cartesiano real.

## 9. Puente a Gráficas

La tarjeta incluye una acción explícita **Abrir en Gráficas** / **Analizar en Gráficas**. Hacer clic sobre la vista previa también puede navegar, pero el botón explícito permanece.

La transición transfiere el **contexto matemático completo**, no solo la expresión visible:
- operación;
- expresión original;
- resultado canónico;
- variable(s);
- límites, dirección de límite, intervalos o restricciones;
- componentes de sistemas;
- regiones/inecuaciones;
- datos complejos relevantes.

Ejemplos:
- derivada → f y f′;
- integral definida → función + límites + región;
- límite → función + punto + dirección;
- sistema → ecuaciones + soluciones comunes;
- inecuación → fronteras + conjunto/región solución.

Principio: **Científica muestra; Gráficas analiza.**

## 10. Contrato de datos entre Resultado y Gráfica

No se debe reparsear LaTeX visual ni texto de Resultado para graficar.

Cada cálculo debe conservar una representación canónica reutilizable por:
- Resultado;
- Gráfica previa;
- “Abrir en Gráficas”;
- Entradas previas / Reusar cuando corresponda.

Esto es obligatorio para evitar fallos como una integral trigonométrica correctamente resuelta pero ilegible por el motor gráfico.

## 11. Inecuaciones: normalización semántica

### Una variable
Lite y Plus deben exponer un conjunto solución canónico estructurado + LaTeX. La forma relacional textual puede conservarse como secundaria.

### Sistemas
Deben exponer:
- tipo de región (acotada / no acotada / vacía);
- restricciones;
- fronteras;
- metadatos de inclusión/exclusión de frontera;
- vértices cuando existan.

Resultado y Gráfica consumen la misma semántica.

## 12. Pasos de solución

Pasos vive **debajo** de las cuatro superficies.

- matemática natural;
- secuencia clara;
- sin inventar detalle;
- Plus puede ofrecer mayor profundidad que Lite;
- no debe desplazar ni comprimir la cuadrícula principal.

## 13. Teclado

B6 sigue siendo la autoridad funcional.

En B7:
- Lite es la referencia visual del dock.
- Plus elimina el efecto de cápsula/globo flotante.
- Dock anclado al borde inferior, integrado al ancho útil.
- Sin sombra grande ni margen inferior artificial.
- Cerrado: franja discreta.
- Abierto: se despliega hacia arriba.
- Nunca se superpone sobre las cuatro superficies.
- Se conserva íntegramente el inventario, categorías, tooltips, Enter, DEL, MCM/MCD, límites, etc. aprobados en B6.

## 14. Limpieza específica de Plus

En Científica:
- se elimina el bloque permanente **Ejemplos**;
- se elimina **Opciones avanzadas / Sustituciones** de la vista principal;
- si en el futuro una sustitución demuestra valor funcional, deberá reaparecer como acceso secundario/contextual, no como bloque fijo.

## 15. Responsive

Viewports de referencia:
- Desktop 1440×900
- Laptop 1280×800
- Tablet 768×1024
- Mobile 390×844

Desktop/laptop priorizan los cuatro paneles simultáneos mediante grid.

Tablet/móvil pueden apilar o reducir columnas, manteniendo:
1. Entrada
2. Resultado
3. Entradas previas
4. Gráfica
5. Pasos
6. contenido secundario

Sin overflow horizontal y sin superposición del teclado.

## 16. Paridad Lite / Plus

Se exige paridad en:
- cuatro superficies;
- presets de Diseño;
- tipografía matemática;
- jerarquía de Resultado;
- recientes reutilizables;
- estados y semántica de Gráfica;
- puente a Gráficas;
- dock inferior;
- copiado;
- comportamiento responsive.

Solo se permiten diferencias por capacidad real del motor.

## 17. Criterio de aceptación

B7 solo puede cerrarse cuando:
1. los cuatro viewports oficiales no presentan overflow;
2. los cuatro presets funcionan y viven en Configuración → Apariencia → Diseño;
3. Entrada/Resultado/Previas/Gráfica son superficies reales y estables;
4. Resultado cubre vacío/éxito/error;
5. recientes son reutilizables sin autoejecución;
6. render matemático es natural y no expone sintaxis cruda;
7. la vista previa gráfica usa semántica de operación y estados no engañosos;
8. “Abrir en Gráficas” transfiere contexto;
9. teclado no se superpone y conserva B6;
10. Plus no muestra Ejemplos/Sustituciones en Científica;
11. Lite/Plus mantienen paridad;
12. gates automáticos aplicables están verdes;
13. revisión visual humana final aprueba el Preview.
