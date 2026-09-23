# S24 — Checklist manual con lector de pantalla

Fuente normativa: Suite exhaustiva v2.0, Fase 17 / gate de release.

## Objetivo

Validar manualmente con un lector de pantalla real lo que axe/Playwright no puede certificar por sí solo: calidad del anuncio, contexto, orden de lectura, cambio de estado, navegación por controles y recuperación tras acciones dinámicas.

## Entornos aceptados

Registrar al menos una pasada completa con uno de estos entornos:
- Windows + NVDA
- Windows + JAWS
- macOS + VoiceOver
- iOS + VoiceOver

Para cierre de release, documentar también navegador, versión del sistema operativo, versión del lector de pantalla y commit SHA probado.

## Convenciones de evidencia

Para cada caso registrar:
- Estado: PASS / FAIL / BLOCKED
- Plataforma / navegador / lector
- Commit SHA
- Paso exacto que falló, si aplica
- Texto anunciado relevante o descripción breve
- Captura/video/audio/nota de evidencia, si existe
- Defecto asociado y regression test agregado, si aplica

## SR-01 — Entrada principal

1. Abrir la calculadora.
2. Navegar hasta el campo matemático principal solo con teclado/lector.
3. Verificar que se anuncie un nombre accesible estable para la entrada matemática.
4. Introducir `2+2`.

Esperado:
- el campo se identifica como entrada matemática;
- el foco es perceptible;
- escribir no provoca anuncios repetitivos o confusos;
- el teclado propio puede abrirse sin perder el contexto del campo.

Resultado: PENDIENTE

## SR-02 — Apertura del teclado matemático

1. Activar el control para abrir el teclado.
2. Navegar por el diálogo/panel.
3. Recorrer categorías/tabs.

Esperado:
- se anuncia “Teclado matemático” como región/diálogo;
- las pestañas tienen nombre y estado seleccionado comprensible;
- el orden de lectura sigue el orden visual/lógico;
- las teclas no disponibles se anuncian como no disponibles;
- no existen controles sin nombre.

Resultado: PENDIENTE

## SR-03 — Cierre con Escape y continuidad de foco

1. Abrir el teclado desde un botón.
2. Cerrar con Escape.
3. Continuar navegando.
4. Repetir abriendo por foco en el campo matemático cuando aplique.

Esperado:
- Escape cierra el panel;
- si el panel fue abierto desde un botón, el contexto de foco vuelve de forma útil al disparador;
- si se abrió por foco del math-field, cerrar no entra en un bucle que reabra el panel;
- la navegación posterior continúa normalmente.

Resultado: PENDIENTE

## SR-04 — Cálculo exitoso y anuncio dinámico

1. Introducir `2+2`.
2. Ejecutar Calcular/Evaluar.
3. Escuchar la respuesta sin mover el foco manualmente.

Esperado:
- el resultado se anuncia una sola vez de manera comprensible;
- el valor 4 queda asociado al resultado;
- no se anuncia información decorativa innecesaria;
- el usuario puede seguir navegando después del anuncio.

Resultado: PENDIENTE

## SR-05 — Error controlado y anuncio dinámico

1. Introducir una expresión inválida, por ejemplo `(`.
2. Ejecutar Calcular/Evaluar.

Esperado:
- el error se anuncia automáticamente;
- se comunica el mensaje de error y no un falso error de red;
- no se pierde el foco ni el contexto de entrada;
- el usuario puede corregir la expresión inmediatamente.

Resultado: PENDIENTE

## SR-06 — Teclas no disponibles

1. Abrir el teclado.
2. Recorrer cualquier tecla marcada como unavailable.

Esperado:
- se anuncia como no disponible/disabled;
- no parece una acción normal disponible;
- su etiqueta sigue siendo comprensible.

Resultado: PENDIENTE

## SR-07 — Historial

1. Realizar al menos dos cálculos.
2. Navegar al historial.
3. Recorrer sus entradas y controles.

Esperado:
- cada entrada tiene lectura comprensible;
- no se pierde la relación expresión → resultado;
- abrir/cerrar historial conserva un orden lógico de foco.

Resultado: PENDIENTE

## SR-08 — Modos y navegación principal

1. Recorrer la navegación principal y cambiar entre modos visibles.
2. Confirmar encabezados/regiones principales.
3. Volver a la entrada.

Esperado:
- controles de navegación tienen nombres únicos/comprensibles;
- el cambio de modo no deja el lector en contenido desmontado;
- la nueva vista tiene un punto de entrada lógico.

Resultado: PENDIENTE

## SR-09 — Responsive / móvil con VoiceOver, si aplica

1. Repetir SR-01, SR-02, SR-03 y SR-04 en viewport móvil/dispositivo real.
2. Confirmar que el panel no bloquea permanentemente controles esenciales.

Esperado:
- entrada, teclado, calcular y resultado son alcanzables;
- no existen ciclos de foco;
- el panel puede cerrarse y el flujo continuar.

Resultado: PENDIENTE

## Criterio de cierre S24

S24 puede cerrarse cuando:
- existe al menos una pasada completa con lector de pantalla real soportado;
- todos los casos SR-01..SR-08 están PASS, o cualquier excepción está documentada y justificada;
- SR-09 está PASS cuando se usa iOS/VoiceOver o un entorno móvil equivalente;
- cualquier FAIL tiene defecto registrado y regression test donde sea automatizable;
- el commit SHA probado corresponde al código candidato a release.
