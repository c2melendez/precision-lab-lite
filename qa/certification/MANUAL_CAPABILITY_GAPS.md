# Manual / Capability Gaps

Estos puntos NO deben marcarse automáticamente como fallo del producto mientras el runner no pueda reproducir fielmente la capacidad requerida.

## G1
- TC17: carácter decimal enviado por teclado numérico real de teléfono. Depende de SO/locale/IME.
- TC23: tecla muerta `^` y composición de teclado físico español. Playwright no reproduce fielmente este comportamiento.

## Otros gaps ya documentados
- C4 CV13–18: persistencia de funciones definidas por usuario; Plus backend es stateless y Lite no tiene registry persistente.
- D2 EN-PC-09: `7%3` ambiguo como porcentaje postfix; validación UI/manual.
- D2 EN-CI-04: renderizado exacto de Avogadro; backend/display manual.
- D3 PN15–17: decimales periódicos; semántica manual/TODO.
- E1c EN-CA-07: integral impropia 0..∞.
- E1c EN-CA-11: integral doble.
- E1d EN-CA-27, EN-CA-29, EN-CA-31, EN-CA-32: límite simbólico/series/eval bar/guard >10k.
- E2a: routing E2E de intención matricial directa aún requiere cobertura explícita.
- E3d3 Plus: posible registro en historial antes del filtrado de restricciones.
- F1 PG15: principalmente estructural.
- F2b UC25: semántica backend/worker adicional recomendable.
- F3a/F3b/F3c: parte de cobertura es estructural/permisiva; revisar semántica externa en reconciliación final.
- AS26: conflicto de semántica `\\log` SymPy natural vs contrato PL base10 requiere advertencia/echo explícito en auditoría final.


## EN-CH-11 — coma decimal regional
- Estado: manual / config-dependent.
- Requiere entorno regional donde la coma decimal sea interpretada según configuración del SO/navegador/MathLive.
- No se debe marcar como automatizado únicamente con locale fijo del runner CI.


## EN-RE-22 — historial restaura entrada idéntica
- Estado: CAPABILITY GAP confirmado durante IN625 H1c.
- Contrato: al seleccionar/reusar una entrada del historial, el campo principal debe recuperar el LaTeX original exactamente, sin wrappers ni espacios añadidos.
- Estado actual: el historial muestra entradas pero no ofrece una acción para restaurarlas al campo principal.
- No se contabiliza como PASS automático hasta implementar el flujo de restauración o validarlo manualmente tras su implementación.


## EN-RE-29 — enlace para compartir
- Estado: CAPABILITY GAP no bloqueante durante IN625 H1d.
- Contrato: validar round-trip de caracteres reservados en URL si existe función de compartir.
- Estado actual: no se detectó una función de share/permalink del campo matemático en el producto actual.


## EN-RE-30 — persistencia del campo tras recarga
- Estado: CAPABILITY GAP no bloqueante durante IN625 H1d.
- Contrato: conservar la entrada del campo tras reload si existe persistencia de entrada.
- Estado actual: existen persistencias auxiliares en algunos módulos/configuraciones, pero no se detectó persistencia del campo matemático principal.


## EN-SG-28 — Detener cálculo prolongado y recuperar operación (H2, pendiente)
- Contrato de origen: IN625 H2, EN-SG-28: detener durante cálculo largo y verificar recuperación desde la interfaz.
- Cobertura identificada en Plus: frontend/src/api/client.ts aplica timeout de 15 segundos con AbortController, incluyendo lectura JSON, y hay pruebas simuladas de recuperación y señales independientes. Esto no demuestra que el backend detenga un trabajo matemático ya iniciado.
- Cobertura faltante: acción explícita de detener desde el flujo del usuario si existe o debe implementarse, interrupción del proceso o worker en un entorno aislado y posterior recuperación de la interfaz. Nunca ejecutar cargas extremas contra producción.
- Estado: REQUIERE EVIDENCIA; no certificar como PASS por timeout simulado. Lite necesita revisión equivalente del worker y la interfaz para clasificar su estado.
- Bloqueo de evidencia: aún no se recuperaron jobs ni logs de gates recientes de Plus; el listado disponible por commit solo cubre PR, no corridas push.


## 2026-10-09 — SG28 auditoría de accesibilidad funcional (sesión de continuidad)
- EN-SG-28 Lite: `CalculusMode` contiene botón de cancelación y limpieza de worker, pero `src/App.tsx` no lo publica dentro de `VISIBLE_MODES`. La navegación normal muestra `BasicScientificMode`, cuya instancia del hook utiliza solamente `getWorker()`, no `cancelWorker()`. Se requiere distinguir «implementado en componente oculto» de «disponible para el usuario»; interfaz pública no acreditada. ESTADO: PRODUCT/CAPABILITY GAP abierto, pendiente de E2E en Científica.
- EN-SG-28 Plus: abortar fetch por timeout de 15 s no garantiza detener cálculo backend. ESTADO: CAPABILITY GAP abierto hasta demostrar interrupción y recuperación en entorno aislado.
- Ninguno es PASS automático por tests de hook, builds o solicitudes abortadas. No probar carga extrema contra producción.


## 2026-10-09 — SG28 Lite PASS acotado y gap restante precisado
- Las notas anteriores de «botón de cancelación no accesible en Científica Lite» reflejan el estado PREVIO y **quedan superadas**. Ahora `src/modes/BasicScientific/BasicScientificMode.tsx` expone «Detener cálculo» e invalida respuestas tardías.
- Evidencia GitHub Actions: Lite SHA `8091c4f72739776575524e90c04890d6eeebb1bd`, run SG28 `37999350568`, job `114053353730`: **2/2 Playwright PASS**; 1) cancelación/recuperación UI con worker simulado; 2) cálculo ordinario `2+3=5` con Web Worker auténtico. Gates cumulative `37999350602`, build `37999350623` y H1d `37999350567` todos SUCCESS para ese SHA.
- GAP REMANENTE Lite: la prueba con worker verdadero **no cancela una operación matemática real mientras está ocupada**. Se necesita test controlado con carga acotada que demuestre terminación efectiva y posterior operación correcta, sin abusar de producción.
- GAP REMANENTE Plus: timeout y `AbortController` del cliente **no demuestran cancelación del trabajo del servidor**. Requiere instrumentación/prueba aislada que confirme terminación del cómputo y recuperación; no inferirlo de un HTTP abort.
- Estado global EN-SG-28: **PARCIALMENTE ACREDITADO**, H2 permanece abierto. La evidencia ya demostrada no debe perderse por referencias a estados anteriores.


## 2026-10-09 — SG28 native worker CI verified run 38000982016
- Lite 3/3 Playwright PASS en run `38000982016`, SHA `3191e9d296deec42a7946a73b5e1dfa686b94748`. La tercera prueba acredita `Worker.terminate()` con trabajo controlado en un worker real de navegador; el motor matemático no está ejecutando una tarea compleja en ese test.
- GAP persistente: terminación real de operación matemática larga y recuperación posterior en Lite; evidencia de detención del cómputo servidor de Plus, no solo `AbortController` de cliente. SG28/H2 no cerrados.
