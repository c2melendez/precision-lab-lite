# Revisión visual de Lite V5

Referencia: `precision-lab-plus-v4-tooltips.html`. Revisión del 20 de septiembre de 2026.

## Verificado

- Se conservan Científica, Matrices, Gráficas, Estadística y Unidades.
- El teclado abre y cierra en 1440×900, 1024×768 y 390×844.
- El panel desplegable de Científica tiene acceso directo a Básico, Símbolos, Álgebra, Trigonométricas, Cálculo y Complejos, con navegación mediante flechas, Inicio y Fin.
- Símbolos distingue variables y constantes mediante colores.
- El campo MathLive aplica sus clases con el atributo `class`, compatible con React 18; no expande horizontalmente la pantalla móvil.
- El panel desktop se coloca 12 px por encima de la barra real. ResizeObserver actualiza el anclaje cuando cambia la altura de la barra, incluidas las teclas recientes.

## Diferencias pendientes respecto del mockup

La integración funcional del teclado no equivale todavía a una reproducción visual del V4:

| Aspecto | V4 de referencia | Integración actual de Lite |
| --- | --- | --- |
| Paleta principal | Superficies claras, azul | Nuevo tema Azul claro como opción inicial; se respetan preferencias guardadas |
| Teclado desktop | Panel inferior amplio | Panel inferior alineado con los márgenes del área de trabajo; altura máxima 45% del viewport |
| Categorías | Pestañas directas | Seis pestañas directas en el panel desplegable de Científica |
| Área de trabajo | Dos columnas amplias | Contenedor desktop ampliado a 1440 px con márgenes laterales de 32 px |

Estas diferencias se documentan para la siguiente integración visual. No se considera aprobada la paridad visual completa ni se publica esta rama por el solo hecho de que pasen las pruebas funcionales.

El nuevo tema conserva los temas anteriores como opciones. La selección y el cursor del editor utilizan ahora los colores del tema activo. El teclado desktop se amplió conservando las filas, funciones y tooltips existentes. El contenido detallado de las tarjetas del mockup todavía no se reproduce íntegramente. Las disposiciones Apilada y Flotante comparten las seis pestañas, permiten cerrar y reabrir el teclado y conservan la inserción sin cerrarlo.

Se revisaron capturas de las vistas iniciales de los cinco módulos en desktop, tablet y móvil. Se retiró la barra deshabilitada en módulos que no registran teclado global, junto con su espacio inferior reservado. La medición del dock se reactiva al regresar a Científica.

## Alcance de las pruebas

La prueba del primer cálculo reveló una recarga del servidor de desarrollo: la traza mostró dos conexiones de Vite y un cambio del hash de dependencias mientras se iniciaba el worker. Se cambió Playwright a build + preview, sin reutilizar servidores, para comprobar el artefacto compilado. CI repite cada caso dos veces y no permite reintentos automáticos.

La prueba responsive verifica apertura, cierre, acceso a teclas seleccionadas, clasificación de símbolos, ausencia de desbordamiento y anclaje desktop. También verifica navegación por las cinco vistas iniciales y recuperación del teclado al regresar a Científica. No demuestra cobertura completa tecla–motor, corrección de todos los cálculos ni fidelidad visual píxel por píxel. Los tres tamaños se ejecutan con Chromium; no constituye validación en Safari o Firefox. La compilación y la suite funcional se ejecutan por separado en CI.
