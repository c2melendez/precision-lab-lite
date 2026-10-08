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
