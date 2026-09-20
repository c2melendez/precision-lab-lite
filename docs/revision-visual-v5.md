# Revisión visual de Lite V5

Referencia: `precision-lab-plus-v4-tooltips.html`. Revisión del 20 de septiembre de 2026.

## Verificado

- Se conservan Científica, Matrices, Gráficas, Estadística y Unidades.
- El teclado abre y cierra en 1440×900, 1024×768 y 390×844.
- Básico y Funciones están dentro del panel desplegable.
- Símbolos distingue variables y constantes mediante colores.
- El campo MathLive aplica sus clases con el atributo `class`, compatible con React 18; no expande horizontalmente la pantalla móvil.
- El panel desktop se coloca 12 px por encima de la barra real. ResizeObserver actualiza el anclaje cuando cambia la altura de la barra, incluidas las teclas recientes.

## Diferencias pendientes respecto del mockup

La integración funcional del teclado no equivale todavía a una reproducción visual del V4:

| Aspecto | V4 de referencia | Integración actual de Lite |
| --- | --- | --- |
| Paleta principal | Superficies claras, azul | Nuevo tema Azul claro como opción inicial; se respetan preferencias guardadas |
| Teclado desktop | Panel inferior amplio | Panel inferior alineado con los márgenes del área de trabajo; altura máxima 45% del viewport |
| Categorías | Pestañas directas | Básico / Funciones y categorías internas |
| Área de trabajo | Dos columnas amplias | Contenedor desktop ampliado a 1440 px con márgenes laterales de 32 px |

Estas diferencias se documentan para la siguiente integración visual. No se considera aprobada la paridad visual completa ni se publica esta rama por el solo hecho de que pasen las pruebas funcionales.

El nuevo tema conserva los temas anteriores como opciones. La selección y el cursor del editor utilizan ahora los colores del tema activo. El teclado desktop se amplió conservando las filas, funciones y tooltips existentes; mantiene Básico / Funciones dentro del panel. Las categorías directas del mockup y el contenido detallado de sus tarjetas todavía no se reproducen íntegramente.

## Alcance de las pruebas

La prueba responsive verifica apertura, cierre, acceso a teclas seleccionadas, clasificación de símbolos, ausencia de desbordamiento y anclaje desktop. No demuestra cobertura completa tecla–motor, corrección de todos los cálculos ni fidelidad visual píxel por píxel. La compilación y la suite funcional se ejecutan por separado en CI.
